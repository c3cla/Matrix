// src/componentes/MapaEtapas.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { obtenerEtapasPorNivel } from '../../api';
import './MapaEtapas.css';

// Importar imágenes desde assets
import etapaActualImg from '../MostrarNiveles/assets/etapa-actual.png';
import etapaBloqueadaImg from '../MostrarNiveles/assets/etapa-bloqueada.png';
import etapaCompletadaImg from '../MostrarNiveles/assets/etapa-completada.png';
import fondoMapaImg from '../MostrarNiveles/assets/fondo-mapa.png';

const MapaEtapas = () => {
  const { id_nivel } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [etapas, setEtapas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para rastrear etapas completadas
  const [completedStages, setCompletedStages] = useState(() => {
    const stored = localStorage.getItem('completedStages');
    return stored ? JSON.parse(stored) : [];
  });

  // Efecto para almacenar en localStorage cuando cambian las etapas completadas
  useEffect(() => {
    localStorage.setItem('completedStages', JSON.stringify(completedStages));
  }, [completedStages]);

  useEffect(() => {
    const fetchEtapas = async () => {
      try {
        const data = await obtenerEtapasPorNivel(id_nivel);
        setEtapas(data);
      } catch (err) {
        setError('Error al cargar las etapas.');
      } finally {
        setLoading(false);
      }
    };

    fetchEtapas();
  }, [id_nivel]);

  // Manejar la finalización de una etapa desde el componente EtapaDetail
  useEffect(() => {
    if (location.state && location.state.completedEtapaId) {
      const { completedEtapaId } = location.state;
      setCompletedStages(prev => [...prev, completedEtapaId]);
      // Limpiar el estado de la navegación
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleEtapaClick = (etapa) => {
    navigate(`/etapa/${etapa.id_etapa}`, { state: { componente: etapa.componente } });
  };

  const obtenerImagenEtapa = (etapa) => {
    if (completedStages.includes(etapa.id_etapa)) {
      return etapaCompletadaImg;
    }

    const currentStage = etapas.find(stage => !completedStages.includes(stage.id_etapa));
    if (currentStage && etapa.id_etapa === currentStage.id_etapa) {
      return etapaActualImg;
    }

    return etapaBloqueadaImg;
  };

  if (loading) {
    return <p>Cargando etapas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (etapas.length === 0) {
    return <p>No hay etapas para este nivel.</p>;
  }

  return (
    <div className="mapa-container">
      <h1>{etapas[0].nivel.nombre}</h1>
      <div className="mapa">
        {/* Fondo del mapa */}
        <img src={fondoMapaImg} alt="Mapa de fondo" className="fondo-mapa" />

        {/* SVG para dibujar las líneas de conexión */}
        <svg className="lineas-camino" xmlns="http://www.w3.org/2000/svg">
          {etapas.map((etapa, index) => {
            if (index < etapas.length - 1) {
              const siguienteEtapa = etapas[index + 1];
              return (
                <line
                  key={`linea-${etapa.id_etapa}`}
                  x1={`${etapa.posicion_x}px`}
                  y1={`${etapa.posicion_y}px`}
                  x2={`${siguienteEtapa.posicion_x}px`}
                  y2={`${siguienteEtapa.posicion_y}px`}
                  stroke="url(#gradiente)"
                  strokeWidth="2"
                />
              );
            }
            return null;
          })}
          <defs>
            <linearGradient id="gradiente" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: 'black', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: 'purple', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'blue', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>

        {/* Renderizar las etapas */}
        {etapas.map((etapa) => (
          <div
            key={etapa.id_etapa}
            className="etapa"
            style={{
              left: `${etapa.posicion_x}px`,
              top: `${etapa.posicion_y}px`,
            }}
            onClick={() => handleEtapaClick(etapa)}
            tabIndex="0"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleEtapaClick(etapa);
              }
            }}
            aria-label={`Selecciona la etapa ${etapa.nombre}`}
          >
            <img
              src={obtenerImagenEtapa(etapa)}
              alt={`Etapa ${etapa.nombre}`}
              className="imagen-etapa"
            />
            <div className="tooltip">
              <h3>{etapa.nombre}</h3>
              <p>{etapa.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapaEtapas;
