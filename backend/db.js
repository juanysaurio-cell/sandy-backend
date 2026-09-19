const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'bkktmc4yvuhaclns8uwh-mysql.services.clever-cloud.com',
  user: process.env.DB_USER || 'uialrcsnm98vb269',
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME || 'bkktmc4yvuhaclns8uwh',
  port: process.env.DB_PORT || 3306
});

conexion.connect((error) => {
    if (error) {
        console.error("Error conectando a MySQL:", error);
        return;
    }

    console.log("Conectado correctamente a MySQL");
});

module.exports = conexion;