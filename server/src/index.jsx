const express = require("express");
const morgan = require("morgan");
const database = require("./database.jsx");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const checkRole = require('./middleware/checkRole.jsx'); // Importa el middleware para verificar roles

// Configuración inicial
const app = express();
app.set("port", 4000);

// Log para verificar que el servidor está escuchando
app.listen(app.get("port"), () => console.log("escuchando en el puerto " + app.get("port")));

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173' // Verificar que la URL del frontend sea correcta
}));
app.use(morgan("dev"));
app.use(express.json()); // Asegúrate de que puedes recibir JSON en las solicitudes

// Logging adicional para todas las rutas
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Recibido`);
    next();
});

// Rutas
app.get('/inventario', checkRole(['administrador', 'usuario']), async (req, res) => {
    let connection;
    try {
        console.log('Conectando a la base de datos para obtener inventario');
        connection = await database.getConnection();
        const [rows] = await connection.query('SELECT * FROM inventario');
        console.log('Inventario obtenido:', rows);
        res.json(rows);
    } catch (err) {
        console.error('Error en la ruta /inventario:', err); // Log de errores
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();  // Liberar la conexión
    }
});

app.put('/inventario/:id', checkRole(['administrador']), async (req, res) => {
    const { id } = req.params;
    const { nombre, cantidad } = req.body;
    let connection;

    try {
        console.log(`Actualizando item con id: ${id}`);
        connection = await database.getConnection();
        await connection.query(
            'UPDATE inventario SET nombre = ?, cantidad = ? WHERE id = ?',
            [nombre, cantidad, id]
        );
        console.log(`Item ${id} actualizado correctamente`);
        res.status(200).send('Item actualizado');
    } catch (err) {
        console.error('Error en la ruta /inventario/:id:', err); // Log de errores
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();  // Liberar la conexión
    }
});

// Registro de Usuario
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        console.log('Intentando registrar usuario:', email);
        const connection = await database.getConnection();
        const [existingUser] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            console.log('Usuario ya registrado:', email);
            return res.status(400).json({ error: 'Usuario ya registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Añadido campo 'role' con valor predeterminado 'usuario'
        await connection.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, 'usuario']);

        console.log('Usuario registrado exitosamente:', email);
        res.status(201).json({ message: 'Registro exitoso' });
    } catch (err) {
        console.error('Error en el registro de usuario:', err); // Log de errores
        res.status(500).json({ error: 'Error en el registro' });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(`Intentando iniciar sesión para: ${email}`);
        const connection = await database.getConnection();
        const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            const user = rows[0];
            console.log('Usuario encontrado:', user);
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                console.log('Contraseña correcta, generando token');
                // Incluye el rol en el payload del token
                const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
                res.json({ token });
            } else {
                console.log('Contraseña incorrecta para:', email);
                res.status(401).json({ error: 'Credenciales incorrectas' });
            }
        } else {
            console.log('Usuario no encontrado:', email);
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error('Error en la ruta /login:', err); // Log de errores
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener todos los usuarios
app.get('/usuarios', checkRole(['administrador']), async (req, res) => {
    let connection;
    try {
        console.log('Conectando a la base de datos para obtener usuarios');
        connection = await database.getConnection();
        const [rows] = await connection.query('SELECT id, username, email, role FROM users');
        console.log('Usuarios obtenidos:', rows);
        res.json(rows);
    } catch (err) {
        console.error('Error en la ruta /usuarios:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Actualizar un usuario
app.put('/usuarios/:id', checkRole(['administrador']), async (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;
    let connection;

    try {
        console.log(`Actualizando usuario con id: ${id}`);
        connection = await database.getConnection();
        await connection.query(
            'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
            [username, email, role, id]
        );
        console.log(`Usuario ${id} actualizado correctamente`);
        res.status(200).send('Usuario actualizado');
    } catch (err) {
        console.error('Error en la ruta /usuarios/:id:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Eliminar un usuario
app.delete('/usuarios/:id', checkRole(['administrador']), async (req, res) => {
    const { id } = req.params;
    let connection;

    try {
        console.log(`Eliminando usuario con id: ${id}`);
        connection = await database.getConnection();
        await connection.query('DELETE FROM users WHERE id = ?', [id]);
        console.log(`Usuario ${id} eliminado correctamente`);
        res.status(200).send('Usuario eliminado');
    } catch (err) {
        console.error('Error en la ruta /usuarios/:id:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});
