// src/componentes/MostrarNiveles.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerNiveles } from '../../api';
import './MostrarNiveles.css';

const MostrarNiveles = () => {
  const [niveles, setNiveles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para navegación

  useEffect(() => {
    const fetchNiveles = async () => {
      try {
        const data = await obtenerNiveles();
        setNiveles(data);
      } catch (err) {
        setError('Error al cargar los niveles.');
      } finally {
        setLoading(false);
      }
    };

    fetchNiveles();
  }, []);

  const handleClick = (id_nivel) => {
    // Navegar a la ruta de MapaEtapas con el id_nivel seleccionado
    navigate(`/nivel/${id_nivel}`);
  };

  if (loading) {
    return <p>Cargando niveles...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="niveles-container">
      {niveles.map((nivel) => (
        <div
          key={nivel.id_nivel}
          className="tarjeta-nivel"
          onClick={() => handleClick(nivel.id_nivel)}
          style={{ cursor: 'pointer' }} // Cambia el cursor para indicar que es clicable
        >
          <h3>{nivel.nombre}</h3>
          <p><strong>OA:</strong> {nivel.OA.nombre}</p>
        </div>
      ))}
    </div>
  );
};

export default MostrarNiveles;
