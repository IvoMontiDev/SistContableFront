// src/components/libroMayorTable.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/libroMayor/';

interface LibroMayorEntry {
  ID_libro: number;
  Fecha: string;
  Descripcion: string;
  Debe: number | null;
  Haber: number | null;
  Saldo: number | null;
  ID_cuenta: number;
}

const LibroMayorTable: React.FC = () => {
  const [libroMayor, setLibroMayor] = useState<LibroMayorEntry[]>([]);

  useEffect(() => {
    cargarLibroMayor();
  }, []);

  const cargarLibroMayor = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log(response)
      setLibroMayor(response.data);
    } catch (error) {
      console.error('Error al cargar el libro mayor:', error);
    }
  };

  return (
    <div>
      <h2>Libro Mayor</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Debe</th>
            <th>Haber</th>
            <th>Saldo</th>
            <th>Código Cuenta</th>
          </tr>
        </thead>
        <tbody>
          {libroMayor.map((entry) => (
            <tr key={entry.ID_libro}>
              <td>{new Date(entry.Fecha).toLocaleDateString()}</td>
              <td>{entry.Descripcion}</td>
              <td>{entry.Debe !== null ? parseFloat(entry.Debe.toString()).toFixed(2) : '0.00'}</td>
              <td>{entry.Haber !== null ? parseFloat(entry.Haber.toString()).toFixed(2) : '0.00'}</td>
              <td>{entry.Saldo !== null ? parseFloat(entry.Saldo.toString()).toFixed(2) : '0.00'}</td>
              <td>{entry.ID_cuenta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LibroMayorTable;
