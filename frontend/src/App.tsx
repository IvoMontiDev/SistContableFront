// src/App.tsx
import React, { useState } from 'react';
import './App.css';
import AsientoForm from './components/asientoForm';
import AsientoTable from './components/asientoTable';
import LibroMayorTable from './components/libroMayorTable';

const App: React.FC = () => {
  const [refresh, setRefresh] = useState(false);
  const [showLibroMayor, setShowLibroMayor] = useState(false);

  const handleAsientoAdded = () => {
    setRefresh(!refresh); // Alterna el estado para recargar el componente
  };

  return (
    <div className="App">
      <h1>Sistema Contable</h1>
      <button onClick={() => setShowLibroMayor(!showLibroMayor)}>
        {showLibroMayor ? "Ver Libro Diario" : "Ver Libro Mayor"}
      </button>
      
      {!showLibroMayor ? (
        <>
          <AsientoForm onAsientoAdded={handleAsientoAdded} />
          <AsientoTable key={refresh.toString()} />
        </>
      ) : (
        <LibroMayorTable />
      )}
    </div>
  );
};

export default App;
