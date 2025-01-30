import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/asientos/';

interface Asiento {
  ID_asiento: number;
  Fecha: string;
  Descripcion: string;
  Debe: number;
  Haber: number;
  Codigo_Cuenta_Debe: number;
  Codigo_Cuenta_Haber: number;
}

const AsientoTable: React.FC = () => {
  const [asientos, setAsientos] = useState<Asiento[]>([]);
  const [editandoAsiento, setEditandoAsiento] = useState<Asiento | null>(null); // Estado para el asiento en edición
  const [formValues, setFormValues] = useState<Partial<Asiento>>({}); // Estado para los valores del formulario

  useEffect(() => {
    cargarAsientos();
  }, []);

  const cargarAsientos = async () => {
    try {
      const response = await axios.get(API_URL);
      setAsientos(response.data);
    } catch (error) {
      console.error('Error al cargar asientos:', error);
    }
  };

  const eliminarAsiento = async (id: number) => {
    try {
      await axios.delete(`${API_URL}eliminar/${id}`);
      alert('Asiento eliminado con éxito');
      cargarAsientos(); // Recarga los asientos después de eliminar
    } catch (error) {
      console.error('Error al eliminar el asiento:', error);
      alert('Hubo un problema al eliminar el asiento');
    }
  };

  const iniciarEdicion = (asiento: Asiento) => {
    setEditandoAsiento(asiento);
    setFormValues(asiento); // Carga los valores actuales en el formulario
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const guardarCambios = async () => {
    if (!editandoAsiento) return;

    try {
      await axios.put(`${API_URL}modificar/${editandoAsiento.ID_asiento}`, formValues);
      alert('Asiento actualizado con éxito');
      setEditandoAsiento(null); // Sale del modo edición
      cargarAsientos(); // Recarga los asientos
    } catch (error) {
      console.error('Error al actualizar el asiento:', error);
      alert('Hubo un problema al actualizar el asiento');
    }
  };

  return (
    <div>
      <h2>Libro Diario</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Debe</th>
            <th>Haber</th>
            <th>Código Cuenta Debe</th>
            <th>Código Cuenta Haber</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asientos.map((asiento) => (
            <tr key={asiento.ID_asiento}>
              {editandoAsiento?.ID_asiento === asiento.ID_asiento ? (
                // Modo edición
                <>
                  <td><input type="text" name="Fecha" value={formValues.Fecha || ''} onChange={handleInputChange} /></td>
                  <td><input type="text" name="Descripcion" value={formValues.Descripcion || ''} onChange={handleInputChange} /></td>
                  <td><input type="number" name="Debe" value={formValues.Debe || 0} onChange={handleInputChange} /></td>
                  <td><input type="number" name="Haber" value={formValues.Haber || 0} onChange={handleInputChange} /></td>
                  <td><input type="number" name="Codigo_Cuenta_Debe" value={formValues.Codigo_Cuenta_Debe || 0} onChange={handleInputChange} /></td>
                  <td><input type="number" name="Codigo_Cuenta_Haber" value={formValues.Codigo_Cuenta_Haber || 0} onChange={handleInputChange} /></td>
                  <td>
                    <button onClick={guardarCambios}>Guardar</button>
                    <button onClick={() => setEditandoAsiento(null)}>Cancelar</button>
                  </td>
                </>
              ) : (
                // Modo vista
                <>
                  <td>{asiento.Fecha}</td>
                  <td>{asiento.Descripcion}</td>
                  <td>{asiento.Debe}</td>
                  <td>{asiento.Haber}</td>
                  <td>{asiento.Codigo_Cuenta_Debe}</td>
                  <td>{asiento.Codigo_Cuenta_Haber}</td>
                  <td>
                    <button onClick={() => iniciarEdicion(asiento)}>Editar</button>
                    <button onClick={() => eliminarAsiento(asiento.ID_asiento)}>Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AsientoTable;
