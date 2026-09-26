import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

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

  const [formData, setFormData] = useState(estadoInicialForm);
  const [editandoId, setEditandoId] = useState(null);

  // Cargar datos por separado para evitar que un fallo de relación rompa la vista
  const cargarDatos = async () => {
    setCargando(true);
    setError(null);

    const [resVentas, resClientes] = await Promise.all([
      supabase.from('ventas').select('*').order('id_venta', { ascending: true }),
      supabase.from('clientes').select('*').order('nomCliente', { ascending: true })
    ]);

    if (resVentas.error || resClientes.error) {
      setError('Error al cargar datos: ' + (resVentas.error?.message || resClientes.error?.message));
      console.error(resVentas.error || resClientes.error);
    } else {
      setVentas(resVentas.data || []);
      setClientes(resClientes.data || []);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Asegurar formato de fecha con hora para que PostgreSQL no rechace el TIMESTAMP
    const fechaConHora = formData.fecha_venta.includes('T') 
      ? formData.fecha_venta 
      : `${formData.fecha_venta}T00:00:00`;

    const payload = {
      id_cliente: parseInt(formData.id_cliente, 10),
      fecha_venta: fechaConHora,
      total: parseFloat(formData.total),
      estado: formData.estado
    };

    if (editandoId) {
      const { error } = await supabase
        .from('ventas')
        .update(payload)
        .eq('id_venta', editandoId);

      if (error) {
        alert('Error al actualizar venta: ' + error.message);
        console.error('Error al actualizar venta:', error);
      } else {
        cargarDatos();
        cancelarEdicion();
      }
    } else {
      const { error } = await supabase
        .from('ventas')
        .insert([payload]);

      if (error) {
        alert('Error al registrar venta: ' + error.message);
        console.error('Error al registrar venta:', error);
      } else {
        cargarDatos();
        setFormData(estadoInicialForm);
      }
    }
  };

  const prepararEdicion = (venta) => {
    setEditandoId(venta.id_venta);
    const fechaFormateada = venta.fecha_venta ? venta.fecha_venta.split('T')[0] : '';
    setFormData({
      id_cliente: venta.id_cliente,
      fecha_venta: fechaFormateada,
      total: venta.total,
      estado: venta.estado
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormData(estadoInicialForm);
  };

  const eliminarVenta = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta venta?')) {
      const { error } = await supabase
        .from('ventas')
        .delete()
        .eq('id_venta', id);

      if (error) {
        alert('Error al eliminar venta: ' + error.message);
        console.error('Error al eliminar venta:', error);
      } else {
        cargarDatos();
      }
    }
  };

  // Buscar el nombre del cliente directamente en el arreglo local
  const obtenerNombreCliente = (id_cliente) => {
    const clienteEncontrado = clientes.find(c => c.id_cliente === id_cliente);
    return clienteEncontrado ? clienteEncontrado.nomCliente : 'Sin cliente';
  };

  if (cargando) return <p>Cargando ventas...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Ventas</h2>

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
              <td>{obtenerNombreCliente(v.id_cliente)}</td>
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