const mysql = require('mysql2/promise');
const dotenv = require("dotenv");
dotenv.config();

// Crear pool de conexiones
const pool = mysql.createPool({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password,
    connectionLimit: 20 // Aumenta el límite de conexiones si es necesario
});


// Verifica si las variables de entorno están bien cargadas
console.log('Conectando a la base de datos con:');
console.log('Host:', process.env.host);
console.log('Database:', process.env.database);
console.log('User:', process.env.user);

const getConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión a la base de datos establecida');
        return connection;
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err); // Log de errores
        throw err;
    }
};

module.exports = {
    getConnection
};
