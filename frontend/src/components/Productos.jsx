import { useEffect, useState } from 'react';
import api from '../services/api';

const estadoInicialForm = {
  nomProducto: '',
  cantidad: '',
  precio: ''
};

function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState(estadoInicialForm);
  const [editandoId, setEditandoId] = useState(null);

  const obtenerProductos = () => {
    setCargando(true);
    api.get('/productos')
      .then(response => {
        const dataReal = Array.isArray(response.data) 
          ? response.data 
          : (response.data.data || []);
        setProductos(dataReal);
        setCargando(false);
      })
      .catch(err => {
        setError('No se pudo cargar la lista de productos');
        setCargando(false);
        console.error(err);
      });
  };

  // ESTO ES LO QUE HACÍA QUE SE QUEDARA CARGANDO:
  useEffect(() => {
    obtenerProductos();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      nomProducto: formData.nomProducto,
      cantidad: parseInt(formData.cantidad, 10),
      precio: parseFloat(formData.precio)
    };

    if (editandoId) {
      api.put(`/productos/${editandoId}`, payload)
        .then(() => {
          obtenerProductos();
          cancelarEdicion();
        })
        .catch(err => console.error('Error al actualizar producto:', err));
    } else {
      api.post('/productos', payload)
        .then(() => {
          obtenerProductos();
          setFormData(estadoInicialForm);
        })
        .catch(err => console.error('Error al crear producto:', err));
    }
  };

  const prepararEdicion = (producto) => {
    setEditandoId(producto.id_producto);
    setFormData({
      nomProducto: producto.nomProducto,
      cantidad: producto.cantidad,
      precio: producto.precio
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormData(estadoInicialForm);
  };

  const eliminarProducto = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      api.delete(`/productos/${id}`)
        .then(() => obtenerProductos())
        .catch(err => console.error('Error al eliminar producto:', err));
    }
  };

  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Productos</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          name="nomProducto"
          placeholder="Nombre del Producto"
          value={formData.nomProducto}
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
          {Array.isArray(productos) && productos.map(p => (
            <tr key={p.id_producto}>
              <td>{p.id_producto}</td>
              <td>{p.nomProducto}</td>
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