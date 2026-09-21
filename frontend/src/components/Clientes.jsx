import { useEffect, useState } from 'react';
import api from '../services/api';

const estadoInicialForm = {
  nomCliente: '',
  contacto: '',
  departamento: '',
  ciudad: ''
};

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el CRUD
  const [formData, setFormData] = useState(estadoInicialForm);
  const [editandoId, setEditandoId] = useState(null);

  // Obtener clientes al cargar
  const obtenerClientes = () => {
    setCargando(true);
    api.get('/clientes')
      .then(response => {
        const dataReal = Array.isArray(response.data) 
          ? response.data 
          : (response.data.data || []);
        setClientes(dataReal);
        setCargando(false);
      })
      .catch(err => {
        setError('No se pudo cargar la lista de clientes');
        setCargando(false);
        console.error(err);
      });
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Crear o Actualizar
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editandoId) {
      // Actualizar cliente
      api.put(`/clientes/${editandoId}`, formData)
        .then(() => {
          obtenerClientes();
          cancelarEdicion();
        })
        .catch(err => console.error('Error al actualizar:', err));
    } else {
      // Crear nuevo cliente
      api.post('/clientes', formData)
        .then(() => {
          obtenerClientes();
          setFormData(estadoInicialForm);
        })
        .catch(err => console.error('Error al crear:', err));
    }
  };

  // Preparar formulario para edición
  const prepararEdicion = (cliente) => {
    setEditandoId(cliente.id_cliente);
    setFormData({
      nomCliente: cliente.nomCliente,
      contacto: cliente.contacto,
      departamento: cliente.departamento,
      ciudad: cliente.ciudad
    });
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormData(estadoInicialForm);
  };

  // Eliminar cliente
  const eliminarCliente = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este cliente?')) {
      api.delete(`/clientes/${id}`)
        .then(() => obtenerClientes())
        .catch(err => console.error('Error al eliminar:', err));
    }
  };

  if (cargando) return <p>Cargando clientes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Clientes</h2>

      {/* Formulario de Registro / Edición */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          name="nomCliente"
          placeholder="Nombre Cliente"
          value={formData.nomCliente}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contacto"
          placeholder="Contacto"
          value={formData.contacto}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="departamento"
          placeholder="Departamento"
          value={formData.departamento}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="ciudad"
          placeholder="Ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          required
        />
        
        <button type="submit">
          {editandoId ? 'Guardar Cambios' : 'Agregar Cliente'}
        </button>
        {editandoId && (
          <button type="button" onClick={cancelarEdicion}>
            Cancelar
          </button>
        )}
      </form>

      {/* Tabla de Clientes */}
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Departamento</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes?.map(c => (
            <tr key={c.id_cliente}>
              <td>{c.id_cliente}</td>
              <td>{c.nomCliente}</td>
              <td>{c.contacto}</td>
              <td>{c.departamento}</td>
              <td>{c.ciudad}</td>
              <td>
                <button onClick={() => prepararEdicion(c)}>Editar</button>
                <button onClick={() => eliminarCliente(c.id_cliente)} style={{ marginLeft: '8px' }}>
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

export default Clientes;