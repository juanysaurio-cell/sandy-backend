const express = require("express");
const cors = require("cors");
const conexion = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// =============================
// Ruta Principal
// =============================
app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend funcionando correctamente"
  });
});

// =============================
// MÓDULO: CLIENTES
// =============================

// Obtener clientes
app.get("/clientes", (req, res) => {
  const sql = "SELECT * FROM clientes";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar clientes:", error);
      return res.status(500).json({ error: "Error al obtener los clientes" });
    }
    res.json(resultados);
  });
});

// Agregar cliente
app.post("/clientes", (req, res) => {
  const { nomCliente, contacto, departamento, ciudad } = req.body;
  const sql = "INSERT INTO clientes (nomCliente, contacto, departamento, ciudad) VALUES (?, ?, ?, ?)";

  conexion.query(sql, [nomCliente, contacto, departamento, ciudad], (error, resultado) => {
    if (error) {
      console.error("Error al crear cliente:", error);
      return res.status(500).json({ error: "Error al registrar cliente" });
    }
    res.status(201).json({ id_cliente: resultado.insertId, nomCliente, contacto, departamento, ciudad });
  });
});

// Actualizar cliente
app.put("/clientes/:id", (req, res) => {
  const { id } = req.params;
  const { nomCliente, contacto, departamento, ciudad } = req.body;
  const sql = "UPDATE clientes SET nomCliente = ?, contacto = ?, departamento = ?, ciudad = ? WHERE id_cliente = ?";

  conexion.query(sql, [nomCliente, contacto, departamento, ciudad, id], (error, resultado) => {
    if (error) {
      console.error("Error al actualizar cliente:", error);
      return res.status(500).json({ error: "Error al actualizar cliente" });
    }
    res.json({ mensaje: "Cliente actualizado correctamente" });
  });
});

// Eliminar cliente
app.delete("/clientes/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM clientes WHERE id_cliente = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar cliente:", error);
      return res.status(500).json({ error: "Error al eliminar cliente" });
    }
    res.json({ mensaje: "Cliente eliminado correctamente" });
  });
});

// =============================
// MÓDULO: PRODUCTOS
// =============================

// Obtener productos
app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar productos:", error);
      return res.status(500).json({ error: "Error al obtener los productos" });
    }
    res.json(resultados);
  });
});

// Agregar producto
app.post("/productos", (req, res) => {
  const { nomProducto, cantidad, precio } = req.body;
  const sql = "INSERT INTO productos (nomProducto, cantidad, precio) VALUES (?, ?, ?)";

  conexion.query(sql, [nomProducto, cantidad, precio], (error, resultado) => {
    if (error) {
      console.error("Error al crear producto:", error);
      return res.status(500).json({ error: "Error al registrar producto" });
    }
    res.status(201).json({ id_producto: resultado.insertId, nomProducto, cantidad, precio });
  });
});

// Actualizar producto
app.put("/productos/:id", (req, res) => {
  const { id } = req.params;
  const { nomProducto, cantidad, precio } = req.body;
  const sql = "UPDATE productos SET nomProducto = ?, cantidad = ?, precio = ? WHERE id_producto = ?";

  conexion.query(sql, [nomProducto, cantidad, precio, id], (error, resultado) => {
    if (error) {
      console.error("Error al actualizar producto:", error);
      return res.status(500).json({ error: "Error al actualizar producto" });
    }
    res.json({ mensaje: "Producto actualizado correctamente" });
  });
});

// Eliminar producto
app.delete("/productos/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM productos WHERE id_producto = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar producto:", error);
      return res.status(500).json({ error: "Error al eliminar producto" });
    }
    res.json({ mensaje: "Producto eliminado correctamente" });
  });
});

// =============================
// MÓDULO: VENTAS
// =============================

// Obtener ventas (con JOIN a clientes)
app.get("/ventas", (req, res) => {
  const sql = `
    SELECT 
      v.id_venta,
      v.id_cliente,
      v.fecha_venta,
      v.total,
      v.estado,
      c.nomCliente
    FROM ventas v
    INNER JOIN clientes c 
      ON v.id_cliente = c.id_cliente
  `;

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar ventas:", error);
      return res.status(500).json({ error: "Error al obtener las ventas" });
    }
    res.json(resultados);
  });
});

// Agregar venta
app.post("/ventas", (req, res) => {
  const { id_cliente, fecha_venta, total, estado } = req.body;
  const sql = "INSERT INTO ventas (id_cliente, fecha_venta, total, estado) VALUES (?, ?, ?, ?)";

  conexion.query(sql, [id_cliente, fecha_venta, total, estado], (error, resultado) => {
    if (error) {
      console.error("Error al registrar venta:", error);
      return res.status(500).json({ error: "Error al registrar la venta" });
    }
    res.status(201).json({ id_venta: resultado.insertId, id_cliente, fecha_venta, total, estado });
  });
});

// Actualizar venta
app.put("/ventas/:id", (req, res) => {
  const { id } = req.params;
  const { id_cliente, fecha_venta, total, estado } = req.body;
  const sql = "UPDATE ventas SET id_cliente = ?, fecha_venta = ?, total = ?, estado = ? WHERE id_venta = ?";

  conexion.query(sql, [id_cliente, fecha_venta, total, estado, id], (error, resultado) => {
    if (error) {
      console.error("Error al actualizar venta:", error);
      return res.status(500).json({ error: "Error al actualizar la venta" });
    }
    res.json({ mensaje: "Venta actualizada correctamente" });
  });
});

// Eliminar venta
app.delete("/ventas/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM ventas WHERE id_venta = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar venta:", error);
      return res.status(500).json({ error: "Error al eliminar la venta" });
    }
    res.json({ mensaje: "Venta eliminada correctamente" });
  });
});

// =============================
// Iniciar Servidor
// =============================
const PUERTO = 3000;
app.listen(PUERTO, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PUERTO}`);
});