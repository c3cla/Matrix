
import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetalleEtapas.css'; 
import * as Componentes from '../indice';

const DetalleEtapas = () => {
  const { id_etapa } = useParams();
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [ComponenteSeleccionado, setComponenteSeleccionado] = useState(null);

  const [etapasCompletadas, setEtapasCompletadas] = useState(() => {
    const almacenadas = localStorage.getItem('etapasCompletadas');
    return almacenadas ? JSON.parse(almacenadas) : [];
  });


  useEffect(() => {
    localStorage.setItem('etapasCompletadas', JSON.stringify(etapasCompletadas));
  }, [etapasCompletadas]);

  useEffect(() => {
    const obtenerEtapa = async () => {
      try {
        const respuesta = await fetch(`https://profeclauvidelas.cl/backend/api/etapas/${id_etapa}/`);
        if (!respuesta.ok) {
          throw new Error('Etapa no encontrada');
        }
        const datos = await respuesta.json();
        setEtapa(datos);
      } catch (error) {
        setError('Error al cargar la etapa.');
      } finally {
        setCargando(false);
      }
    };

    obtenerEtapa();
  }, [id_etapa]);

  useEffect(() => {
    if (etapa && etapa.componente) {
      const componenteNombre = etapa.componente;
      const Componente = Componentes[componenteNombre];
      if (Componente) {
        setComponenteSeleccionado(() => Componente);
      } else {
        setError('Componente no encontrado.');
      }
    }
  }, [etapa]);

 
  const marcarEtapaComoCompletada = async () => {
    try {
      const token = localStorage.getItem('token'); // Asegúrate de tener el token de autenticación
      const respuesta = await fetch(`https://profeclauvidelas.cl/backend/api/etapas/${etapa.id_etapa}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ completado: true }), // Asegúrate de que tu modelo tenga este campo
      });

      if (!respuesta.ok) {
        throw new Error('Error al completar la etapa.');
      }


      setEtapasCompletadas(prev => [...prev, etapa.id_etapa]);
      
      navigate('/nivel/' + etapa.id_nivel, { state: { id_etapa_completada: etapa.id_etapa } });
    } catch (error) {
      setError('No se pudo completar la etapa.');
    }
  };

  if (cargando) {
    return <p>Cargando etapa...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!etapa) {
    return <p>Etapa no encontrada.</p>;
  }

  return (
    <div className="detalles-etapa-container">
      <h1>{etapa.nombre}</h1>
      <p>{etapa.descripcion}</p>

      {/* Renderizar el componente dinámico y pasar la función para completar la etapa */}
      {ComponenteSeleccionado ? (
        <Suspense fallback={<div>Cargando componente...</div>}>
          <ComponenteSeleccionado etapa={etapa} marcarCompletada={marcarEtapaComoCompletada} />
        </Suspense>
      ) : (
        <p>No hay un componente asociado a esta etapa.</p>
      )}

      {/* Botón para volver al mapa sin completar la etapa */}
      <button onClick={() => navigate('/nivel/' + etapa.id_nivel)}>Volver al Mapa</button>
    </div>
  );
};

export default DetalleEtapas;
