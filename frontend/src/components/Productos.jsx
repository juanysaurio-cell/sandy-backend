import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const estadoInicialForm = {
  nomproducto: '',
  cantidad: '',
  precio: ''
};

function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState(estadoInicialForm);
  const [editandoId, setEditandoId] = useState(null);

  const obtenerProductos = async () => {
    setCargando(true);
    setError(null);
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('id_producto', { ascending: true });

    if (error) {
      setError('No se pudo cargar la lista de productos: ' + error.message);
      console.error(error);
    } else {
      setProductos(data || []);
    }
    setCargando(false);
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nomproducto: formData.nomproducto,
      cantidad: parseInt(formData.cantidad, 10),
      precio: parseFloat(formData.precio)
    };

    if (editandoId) {
      const { error } = await supabase
        .from('productos')
        .update(payload)
        .eq('id_producto', editandoId);

      if (error) {
        alert('Error al actualizar producto: ' + error.message);
        console.error('Error al actualizar producto:', error);
      } else {
        obtenerProductos();
        cancelarEdicion();
      }
    } else {
      const { error } = await supabase
        .from('productos')
        .insert([payload]);

      if (error) {
        alert('Error al crear producto: ' + error.message);
        console.error('Error al crear producto:', error);
      } else {
        obtenerProductos();
        setFormData(estadoInicialForm);
      }
    }
  };

  const prepararEdicion = (producto) => {
    setEditandoId(producto.id_producto);
    setFormData({
      nomproducto: producto.nomproducto,
      cantidad: producto.cantidad,
      precio: producto.precio
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormData(estadoInicialForm);
  };

  const eliminarProducto = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      const { error } = await supabase
        .from('productos')
        .delete()
        .eq('id_producto', id);

      if (error) {
        alert('Error al eliminar producto: ' + error.message);
        console.error('Error al eliminar producto:', error);
      } else {
        obtenerProductos();
      }
    }
  };

  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Productos</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          name="nomproducto"
          placeholder="Nombre del Producto"
          value={formData.nomproducto}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={formData.cantidad}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="precio"
          placeholder="Precio"
          value={formData.precio}
          onChange={handleChange}
          required
        />
        
        <button type="submit">
          {editandoId ? 'Guardar Cambios' : 'Agregar Producto'}
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
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id_producto}>
              <td>{p.id_producto}</td>
              <td>{p.nomproducto}</td>
              <td>{p.cantidad}</td>
              <td>{p.precio}</td>
              <td>
                <button onClick={() => prepararEdicion(p)}>Editar</button>
                <button onClick={() => eliminarProducto(p.id_producto)} style={{ marginLeft: '8px' }}>
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

export default Productos;