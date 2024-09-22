const express = require("express");
const { check, validationResult } = require('express-validator');
const morgan = require("morgan");
const database = require("./database.jsx");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const checkRole = require('./middleware/checkRole.jsx'); // Importa el middleware para verificar roles
const mailService = require('./mailService.jsx');
require('dotenv').config();

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

app.put('/inventario/:id/add', checkRole(['administrador']), async (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.body;
    let connection;

    console.log(`ID recibido en el backend: ${id}`); // Verificar el id recibido
    console.log(`Cantidad recibida en el backend: ${cantidad}`); // Verificar la cantidad recibida

    try {
        connection = await database.getConnection();
        await connection.query(
            'UPDATE inventario SET cantidad = cantidad + ? WHERE id = ?',
            [cantidad, id]
        );
        console.log(`Cantidad añadida al inventario para el item ${id}`);
        res.status(200).json({ message: 'Cantidad añadida al inventario' });
    } catch (err) {
        console.error('Error en la ruta /inventario/:id/add:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

app.post('/inventario', [
    check('nombre').notEmpty().withMessage('Nombre es obligatorio'),
    check('cantidad').isInt({ min: 0 }).withMessage('Cantidad debe ser un número entero positivo')
], checkRole(['administrador']), async (req, res) => {
    const { nombre, cantidad } = req.body;
    let connection;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        console.log('Conectando a la base de datos para agregar un nuevo item');
        connection = await database.getConnection();
        await connection.query(
            'INSERT INTO inventario (nombre, cantidad) VALUES (?, ?)',
            [nombre, cantidad]
        );
        console.log('Item agregado correctamente');
        res.status(201).send('Item agregado');
    } catch (err) {
        console.error('Error en la ruta /inventario:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

app.delete('/inventario/:id', checkRole(['administrador']), async (req, res) => {
    const { id } = req.params;
    let connection;

    try {
        console.log(`Conectando a la base de datos para eliminar el item con id: ${id}`);
        connection = await database.getConnection();
        await connection.query('DELETE FROM inventario WHERE id = ?', [id]);
        console.log(`Item ${id} eliminado correctamente`);
        res.status(200).send('Item eliminado');
    } catch (err) {
        console.error('Error en la ruta /inventario/:id:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Registrar una solicitud de producto y actualizar el inventario
app.post('/solicitudes', checkRole(['administrador', 'usuario']), async (req, res) => {
    const { producto_id, cantidad } = req.body;
    const usuario_id = req.user.id;
    let connection;

    try {
        connection = await database.getConnection();

        // Verificar si hay suficiente cantidad en inventario
        const [inventario] = await connection.query('SELECT cantidad FROM inventario WHERE id = ?', [producto_id]);
        if (inventario.length === 0 || inventario[0].cantidad < cantidad) {
            return res.status(400).json({ success: false, error: 'Cantidad insuficiente en inventario' });
        }

        // Registrar la solicitud
        await connection.query(
            'INSERT INTO solicitudes (producto_id, usuario_id, cantidad, estado) VALUES (?, ?, ?, ?)',
            [producto_id, usuario_id, cantidad, 'pendiente']
        );

        // Descontar la cantidad del inventario
        await connection.query(
            'UPDATE inventario SET cantidad = cantidad - ? WHERE id = ?',
            [cantidad, producto_id]
        );

        res.status(201).json({ success: true, message: 'Solicitud registrada' });
    } catch (err) {
        console.error('Error en la ruta /solicitudes:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

app.get('/solicitudes', checkRole(['administrador']), async (req, res) => {
    let connection;

    try {
        console.log('Obteniendo solicitudes pendientes con fecha de solicitud');
        connection = await database.getConnection();
        const [rows] = await connection.query(
            'SELECT s.id, i.nombre AS producto, s.cantidad, u.username AS usuario, s.estado, s.fecha_solicitud ' +
            'FROM solicitudes s ' +
            'JOIN inventario i ON s.producto_id = i.id ' +
            'JOIN users u ON s.usuario_id = u.id ' +
            'WHERE s.estado = "pendiente"'
        );
        res.json(rows);
    } catch (err) {
        console.error('Error en la ruta /solicitudes:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});


app.put('/solicitudes/:id/approve', checkRole(['administrador']), async (req, res) => {
    const { id } = req.params;
    let connection;

    try {
        console.log(`Aprobando solicitud con id: ${id}`);
        connection = await database.getConnection();

        const [solicitud] = await connection.query('SELECT * FROM solicitudes WHERE id = ?', [id]);
        if (solicitud.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        const { usuario_id, producto_id, cantidad } = solicitud[0];
        console.log('Solicitud obtenida:', solicitud[0]);

        await connection.query('UPDATE solicitudes SET estado = "aprobada" WHERE id = ?', [id]);

        const [usuario] = await connection.query('SELECT username, email FROM users WHERE id = ?', [usuario_id]);
        
        if (usuario.length > 0) {
            const productoNombre = await getProductoNombre(producto_id, connection);
            console.log('Nombre del producto:', productoNombre);

            const data = {
                username: usuario[0].username,
                cantidad,
                producto: productoNombre, // Nombre del producto
                estado: 'aprobada'
            };

            const pdfPath = await mailService.createPdf(data);
            await mailService.sendMail(usuario[0].email, 'Solicitud Aprobada', 'Su solicitud ha sido aprobada.', pdfPath);
        }

        res.status(200).json({ message: 'Solicitud aprobada' });
    } catch (err) {
        console.error('Error en la ruta /solicitudes/:id/approve:', err);
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

app.put('/solicitudes/:id/reject', checkRole(['administrador']), async (req, res) => {
    const { id } = req.params;
    let connection;

    try {
        console.log(`Rechazando solicitud con id: ${id}`);
        connection = await database.getConnection();

        // Actualiza el estado de la solicitud a "rechazada"
        const [result] = await connection.query('UPDATE solicitudes SET estado = "rechazada" WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        // Obtiene los detalles de la solicitud rechazada
        const [solicitud] = await connection.query('SELECT producto_id, cantidad, usuario_id FROM solicitudes WHERE id = ?', [id]);
        console.log('Solicitud obtenida:', solicitud);
        if (solicitud.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada en la consulta' });
        }
        
        const { producto_id, cantidad, usuario_id } = solicitud[0];

        console.log('Solicitud rechazada:', solicitud[0]);

        // Reintegrar la cantidad al inventario
        await connection.query(
            'UPDATE inventario SET cantidad = cantidad + ? WHERE id = ?',
            [cantidad, producto_id]
        );

        const [usuario] = await connection.query('SELECT username, email FROM users WHERE id = ?', [usuario_id]);
        
        if (usuario.length > 0) {
            const productoNombre = await getProductoNombre(producto_id, connection);
            console.log('Nombre del producto rechazado:', productoNombre);

            const data = {
                username: usuario[0].username,
                cantidad,
                producto: productoNombre, // Nombre del producto
                estado: 'rechazada'
            };

            const pdfPath = await mailService.createPdf(data);
            await mailService.sendMail(usuario[0].email, 'Solicitud Rechazada', 'Su solicitud ha sido rechazada.', pdfPath);
        }

        res.status(200).json({ message: 'Solicitud rechazada y cantidad reintegrada al inventario' });
    } catch (err) {
        console.error('Error en la ruta /solicitudes/:id/reject:', err);
        res.status(500).json({ error: 'Error en el servidor. Intente nuevamente más tarde.' });
    } finally {
        if (connection) connection.release();
    }
});

// Función auxiliar para obtener el nombre del producto basado en su ID
async function getProductoNombre(productoId, connection) {
    const [producto] = await connection.query('SELECT nombre FROM inventario WHERE id = ?', [productoId]);
    console.log('Producto encontrado:', producto);
    return producto.length > 0 ? producto[0].nombre : 'Producto no encontrado';
}


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

app.get('/informes', checkRole(['administrador']), async (req, res) => {
    let connection;
    const estado = req.query.estado; // Obtén el estado de la consulta

    try {
        console.log('Intentando generar el informe con estado:', estado);
        connection = await database.getConnection();
        
        // Consulta SQL con JOIN y filtrado por estado
        let query = `SELECT s.usuario_id, i.nombre AS producto_nombre, s.cantidad, s.estado, s.fecha_solicitud
                     FROM solicitudes s
                     LEFT JOIN inventario i ON s.producto_id = i.id`;
        
        // Agregar condición de estado si se proporciona
        if (estado) {
            query += ' WHERE s.estado = ?';
        } else {
            query += ' WHERE s.estado IN ("aprobada", "rechazada")';
        }

        const [rows] = await connection.query(query, estado ? [estado] : []);
        
        console.log('Informe generado con éxito:', rows);
        res.json(rows);
    } catch (err) {
        console.error('Error al generar el informe:', err);
        res.status(500).json({ error: 'Error al generar el informe' });
    } finally {
        if (connection) connection.release();
    }
});


