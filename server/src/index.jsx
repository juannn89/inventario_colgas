const express = require("express");
const morgan = require("morgan");
const database = require("./database.jsx");
const cors = require("cors");


//Configuración inicial
const app = express();
app.set("port",4000);
app.listen(app.get("port"));
console.log("escuchando"+app.get("port"));

//Middlewares
app.use(cors());
app.use(morgan("dev"));

//Rutas
app.get('/inventario', async (req, res) => {
    try {
        const connection = await database.getConnection();
        const [rows] = await connection.query('SELECT * FROM inventario');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});