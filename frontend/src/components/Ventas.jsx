import { useEffect, useState } from 'react';
import api from '../services/api';

const estadoInicialForm = {
  id_cliente: '',
  fecha_venta: '',
  total: '',
  estado: 'Completado'
};

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el CRUD
  const [formData, setFormData] = useState(estadoInicialForm);
  const [editandoId, setEditandoId] = useState(null);

  // Cargar ventas y clientes al inicializar
  const cargarDatos = () => {
    setCargando(true);
    Promise.all([
      api.get('/ventas'),
      api.get('/clientes')
    ])
      .then(([resVentas, resClientes]) => {
        setVentas(resVentas.data);
        setClientes(resClientes.data);
        setCargando(false);
      })
      .catch(err => {
        setError('No se pudo cargar la información');
        setCargando(false);
        console.error(err);
      });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Manejar cambios en las entradas del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Crear o Actualizar Venta
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editandoId) {
      // Actualizar venta
      api.put(`/ventas/${editandoId}`, formData)
        .then(() => {
          cargarDatos();
          cancelarEdicion();
        })
        .catch(err => console.error('Error al actualizar venta:', err));
    } else {
      // Crear nueva venta
      api.post('/ventas', formData)
        .then(() => {
          cargarDatos();
          setFormData(estadoInicialForm);
        })
        .catch(err => console.error('Error al registrar venta:', err));
    }
  };

  // Cargar datos de la venta en el formulario
  const prepararEdicion = (venta) => {
    setEditandoId(venta.id_venta);
    // Formatear la fecha si viene con hora (ISO)
    const fechaFormateada = venta.fecha_venta ? venta.fecha_venta.split('T')[0] : '';
    setFormData({
      id_cliente: venta.id_cliente,
      fecha_venta: fechaFormateada,
      total: venta.total,
      estado: venta.estado
    });
  };

  // Resetear formulario
  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormData(estadoInicialForm);
  };

  // Eliminar Venta
  const eliminarVenta = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta venta?')) {
      api.delete(`/ventas/${id}`)
        .then(() => cargarDatos())
        .catch(err => console.error('Error al eliminar venta:', err));
    }
  };

  if (cargando) return <p>Cargando ventas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Ventas</h2>

      {/* Formulario de Registro / Edición */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <select
          name="id_cliente"
          value={formData.id_cliente}
          onChange={handleChange}
          required
        >
          <option value="">-- Selecciona un Cliente --</option>
          {clientes.map(c => (
            <option key={c.id_cliente} value={c.id_cliente}>
              {c.nomCliente}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="fecha_venta"
          value={formData.fecha_venta}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          step="0.01"
          name="total"
          placeholder="Total"
          value={formData.total}
          onChange={handleChange}
          required
        />

        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          required
        >
          <option value="Completado">Completado</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Cancelado">Cancelado</option>
        </select>

        <button type="submit">
          {editandoId ? 'Guardar Cambios' : 'Registrar Venta'}
        </button>
        {editandoId && (
          <button type="button" onClick={cancelarEdicion}>
            Cancelar
          </button>
        )}
      </form>

      {/* Tabla de Ventas */}
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id_venta}>
              <td>{v.id_venta}</td>
              <td>{v.nomCliente}</td>
              <td>{v.fecha_venta ? v.fecha_venta.split('T')[0] : ''}</td>
              <td>{v.total}</td>
              <td>{v.estado}</td>
              <td>
                <button onClick={() => prepararEdicion(v)}>Editar</button>
                <button onClick={() => eliminarVenta(v.id_venta)} style={{ marginLeft: '8px' }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Ventas;