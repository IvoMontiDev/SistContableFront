import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/asientos';
const CUENTAS_URL = 'http://localhost:3000/api/cuentas';

interface Asiento {
  fecha: string;
  descripcion: string;
  debe: number;
  haber: number;
  codigoCuentaDebe: number;
  codigoCuentaHaber: number;
}

interface Cuenta {
  ID_cuenta: number;
  Codigo_cuenta: string;
  Nombre: string;
  Saldo: number;
}

interface AsientoFormProps {
  onAsientoAdded: () => void;
}

const AsientoForm: React.FC<AsientoFormProps> = ({ onAsientoAdded }) => {
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [debe, setDebe] = useState('');
  const [haber, setHaber] = useState('');
  const [codigoCuentaDebe, setCodigoCuentaDebe] = useState<number | undefined>(undefined);
  const [codigoCuentaHaber, setCodigoCuentaHaber] = useState<number | undefined>(undefined);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const response = await axios.get(CUENTAS_URL);
        setCuentas(response.data);
      } catch (error) {
        console.error('Error al cargar las cuentas:', error);
      }
    };

    fetchCuentas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que debe y haber sean mayores a 0
    if (parseFloat(debe) <= 0 || parseFloat(haber) <= 0) {
      alert('Los montos de debe y haber deben ser mayores a 0');
      return;
    }

    // Aquí asumimos que ambos montos son iguales, de lo contrario, ajusta la validación
    if (parseFloat(debe) !== parseFloat(haber)) {
      alert('Los montos de debe y haber deben ser iguales');
      return;
    }

    // Crear el asiento de debe
    const nuevoAsientoDebe: Asiento = {
      fecha,
      descripcion,
      debe: parseFloat(debe),
      haber: 0, // Para la cuenta debe
      codigoCuentaDebe: codigoCuentaDebe!,
      codigoCuentaHaber: codigoCuentaHaber!,
    };

    // Crear el asiento de haber
    const nuevoAsientoHaber: Asiento = {
      fecha,
      descripcion,
      debe: 0, // Para la cuenta haber
      haber: parseFloat(haber),
      codigoCuentaDebe: codigoCuentaDebe!,
      codigoCuentaHaber: codigoCuentaHaber!,
    };
    

    try {
      // Enviar ambos asientos por separado
      await axios.post(API_URL, nuevoAsientoDebe);
      await axios.post(API_URL, nuevoAsientoHaber);

      alert('Asiento registrado con éxito');
      onAsientoAdded();
      // Reiniciar campos del formulario
      setFecha('');
      setDescripcion('');
      setDebe('');
      setHaber('');
      setCodigoCuentaDebe(undefined);
      setCodigoCuentaHaber(undefined);
    } catch (error) {
      console.error('Error al registrar el asiento:', error);
      alert('Hubo un problema al registrar el asiento');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar Asiento</h2>
      <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
      <input type="text" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
      <input type="number" placeholder="Debe" step="0.01" value={debe} onChange={(e) => setDebe(e.target.value)} required />
      <input type="number" placeholder="Haber" step="0.01" value={haber} onChange={(e) => setHaber(e.target.value)} required />
      
      <select value={codigoCuentaDebe} onChange={(e) => setCodigoCuentaDebe(Number(e.target.value))} required>
        <option value="">Seleccione Cuenta Debe</option>
        {cuentas.map((cuenta) => (
          <option key={cuenta.ID_cuenta} value={cuenta.ID_cuenta}>
            {cuenta.Nombre} ({cuenta.Codigo_cuenta})
          </option>
        ))}
      </select>
  
      <select value={codigoCuentaHaber} onChange={(e) => {
        const selectedValue = Number(e.target.value);
        // Evitar seleccionar la misma cuenta
        if (selectedValue === codigoCuentaDebe) {
          alert('No se puede seleccionar la misma cuenta para debe y haber.');
        } else {
          setCodigoCuentaHaber(selectedValue);
        }
      }} required>
        <option value="">Seleccione Cuenta Haber</option>
        {cuentas.map((cuenta) => (
          <option key={cuenta.ID_cuenta} value={cuenta.ID_cuenta}>
            {cuenta.Nombre} ({cuenta.Codigo_cuenta})
          </option>
        ))}
      </select>
  
      <button type="submit">Registrar Asiento</button>
    </form>
  );
};

export default AsientoForm;
