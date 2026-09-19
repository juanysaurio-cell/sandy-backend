const mysql = require("mysql2");
require("dotenv").config();

// 1. Primero creas la conexión
const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// 2. Después la usas para conectar
conexion.connect((error) => {
    if (error) {
        console.error("Error conectando a MySQL:", error);
        return;
    }

    console.log("Conectado correctamente a MySQL");
});

module.exports = conexion;