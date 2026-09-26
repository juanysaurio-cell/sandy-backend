import { useEffect, useState } from 'react';
import { supabase } from "../services/supabaseClient"; // ✅ Esto es correcto porque entra a la carpeta 'services'

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

  const [formData, setFormData] = useState(estadoInicialForm);
  const [editandoId, setEditandoId] = useState(null);

  // Obtener clientes desde Supabase
  const obtenerClientes = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('id_cliente', { ascending: true });

    if (error) {
      setError('No se pudo cargar la lista de clientes');
      console.error(error);
    } else {
      setClientes(data || []);
    }
    setCargando(false);
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editandoId) {
      // Actualizar cliente
      const { error } = await supabase
        .from('clientes')
        .update(formData)
        .eq('id_cliente', editandoId);

      if (error) {
        console.error('Error al actualizar:', error);
      } else {
        obtenerClientes();
        cancelarEdicion();
      }
    } else {
      // Crear nuevo cliente
      const { error } = await supabase
        .from('clientes')
        .insert([formData]);

      if (error) {
        console.error('Error al crear:', error);
      } else {
        obtenerClientes();
        setFormData(estadoInicialForm);
      }
    }
  };

  const prepararEdicion = (cliente) => {
    setEditandoId(cliente.id_cliente);
    setFormData({
      nomCliente: cliente.nomCliente,
      contacto: cliente.contacto,
      departamento: cliente.departamento,
      ciudad: cliente.ciudad
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormData(estadoInicialForm);
  };

  const eliminarCliente = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este cliente?')) {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id_cliente', id);

      if (error) {
        console.error('Error al eliminar:', error);
      } else {
        obtenerClientes();
      }
    }
  };

  if (cargando) return <p>Cargando clientes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Clientes</h2>

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
          {clientes.map(c => (
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