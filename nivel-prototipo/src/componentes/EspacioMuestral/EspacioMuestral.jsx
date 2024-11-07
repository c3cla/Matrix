import React, { useState, useEffect } from 'react';
import { BarraProgreso, Resumen } from "../indice";
import './EspacioMuestral.css';

// Importación de los símbolos
const simbolosImportados = import.meta.glob('./simbolos/*.png', { eager: true });
const simbolosOrdenados = Object.entries(simbolosImportados)
  .sort(([pathA], [pathB]) => {
    const numA = parseInt(pathA.match(/(\d+)\.png$/)[1]);
    const numB = parseInt(pathB.match(/(\d+)\.png$/)[1]);
    return numA - numB;
  })
  .map(([, module]) => module.default);

const simbolosPosibles = simbolosOrdenados; // Array de todos los símbolos disponibles

const EspacioMuestral = () => {
  // Estados principales
  const [etapa, setEtapa] = useState(1);
  const [tiempoInicio, setTiempoInicio] = useState(Date.now());
  const [tiempoTotal, setTiempoTotal] = useState(0);
  const [resultados, setResultados] = useState([]);
  const [barajaInicial, setBarajaInicial] = useState([]); // Símbolos para recuadro-principal
  const [espacioMuestral, setEspacioMuestral] = useState([]); // Símbolos seleccionados por el usuario
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [mensajeRetroalimentacion, setMensajeRetroalimentacion] = useState('');
  const [mostrarRetroalimentacion, setMostrarRetroalimentacion] = useState(false);
  const [cuentaRegresiva, setCuentaRegresiva] = useState(3);
  const [mostrarPregunta, setMostrarPregunta] = useState(false);
  
  // Estado para mantener el orden estático de los símbolos en el espacio muestral
  const [simbolosEspacioMuestralOrdenados, setSimbolosEspacioMuestralOrdenados] = useState([]);

  // Función para determinar la cantidad de símbolos según la etapa
  const obtenerCantidadSimbolos = (etapaActual) => {
    if (etapaActual === 1) return 5;
    if (etapaActual === 2) return 7;
    if (etapaActual === 3) return 9;
    return 5; // Valor por defecto
  };

  // Cuenta regresiva antes de cada pregunta
  useEffect(() => {
    if (cuentaRegresiva > 0) {
      const timer = setTimeout(() => setCuentaRegresiva(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setMostrarPregunta(true);
      setTiempoInicio(Date.now());
    }
  }, [cuentaRegresiva]);

  // Configura la baraja inicial para cada etapa y reinicia el espacio muestral
  useEffect(() => {
    if (!mostrarPregunta) return;

    const cantidadSimbolos = obtenerCantidadSimbolos(etapa);

    // Seleccionar símbolos correctos aleatoriamente para la baraja inicial
    const nuevosSimbolos = simbolosPosibles
      .slice() // Clonar el array para evitar mutaciones
      .sort(() => 0.5 - Math.random()) // Barajar temporalmente
      .slice(0, cantidadSimbolos);

    setBarajaInicial(nuevosSimbolos);
    setEspacioMuestral([]); // Reiniciar selección de símbolos

    // Barajar todos los símbolos para el espacio muestral y mantener el orden estático
    const simbolosEspacioMuestral = [...simbolosPosibles].sort(() => 0.5 - Math.random());
    setSimbolosEspacioMuestralOrdenados(simbolosEspacioMuestral);
  }, [etapa, mostrarPregunta]);

  // Mezcla los símbolos de recuadro-principal cada 1.5 segundos
  useEffect(() => {
    if (!mostrarPregunta) return;

    const interval = setInterval(() => {
      setBarajaInicial(prevBaraja => [...prevBaraja].sort(() => 0.5 - Math.random()));
    }, 1500);

    return () => clearInterval(interval);
  }, [mostrarPregunta]);

  // Función para seleccionar/deseleccionar un símbolo en el espacio muestral
  const handleToggleSeleccion = (simbolo) => {
    setEspacioMuestral(prevSeleccion => {
      if (prevSeleccion.includes(simbolo)) {
        // Deseleccionar símbolo
        return prevSeleccion.filter(s => s !== simbolo);
      } else {
        // Seleccionar símbolo
        return [...prevSeleccion, simbolo];
      }
    });
  };

  // Función para verificar la respuesta del usuario
  const verificarRespuesta = () => {
    const simbolosEspacioMuestral = [...espacioMuestral].sort();
    const simbolosCorrectos = [...barajaInicial].sort();

    const esCorrecto =
      simbolosEspacioMuestral.length === simbolosCorrectos.length &&
      simbolosEspacioMuestral.every((simbolo, index) => simbolo === simbolosCorrectos[index]);

    if (esCorrecto) {
      const tiempoRespuesta = (Date.now() - tiempoInicio) / 1000;

      setResultados(prevResultados => [
        ...prevResultados,
        { correcta: true, tiempo: tiempoRespuesta },
      ]);
      setTiempoTotal(prevTiempoTotal => prevTiempoTotal + tiempoRespuesta);

      siguienteEtapa();
    } else {
      setMensajeRetroalimentacion(
        '¡Casi lo logras! Pero ese no es el espacio muestral de este experimento.'
      );
      setMostrarRetroalimentacion(true);
    }
  };

  // Función para cerrar la retroalimentación y permitir reintentar
  const cerrarRetroalimentacion = () => {
    setMostrarRetroalimentacion(false);
    setEspacioMuestral([]);
    setMostrarPregunta(true); // Mostrar la etapa actual sin cuenta regresiva
    setTiempoInicio(Date.now()); // Reiniciar el tiempo de inicio
  };

  // Función para avanzar a la siguiente etapa o mostrar el resumen
  const siguienteEtapa = () => {
    if (etapa < 3) {
      setEtapa(etapa + 1);
      setCuentaRegresiva(3);
      setMostrarPregunta(false);
    } else {
      setMostrarResumen(true);
    }
  };

  // Función para reiniciar el quiz desde el resumen
  const reiniciarQuiz = () => {
    setResultados([]);
    setTiempoTotal(0);
    setEtapa(1);
    setMostrarResumen(false);
    setCuentaRegresiva(3);
    setMostrarPregunta(false);
  };

  // Función para continuar después del resumen
  const continuarQuiz = () => {
    setMostrarResumen(false);
  };

  // Cálculo del porcentaje de progreso
  const porcentajeProgreso = ((etapa - 1) / 3) * 100;

  return (
    <div className="espacio-muestral-container">
      {mostrarResumen ? (
        <Resumen 
          resultados={resultados} 
          tiempoTotal={tiempoTotal} 
          totalPreguntas={3} 
          reiniciarQuiz={reiniciarQuiz} 
          continuarQuiz={continuarQuiz} 
        />
      ) : (
        <>
          {cuentaRegresiva > 0 && !mostrarPregunta ? (
            <div className="cuenta-regresiva">
              <p>Prepárate... {cuentaRegresiva}</p>
            </div>
          ) : (
            <div className="contenedor-izquierdo">
              <BarraProgreso progreso={porcentajeProgreso} />
              <div className="instrucciones">
                <p>
                  Descubre todos los posibles resultados del experimento y selecciona los que correspondan al espacio muestral.
                </p>
              </div>
              
              {/* Recorrido Principal */}
              <div className="recuadro-principal">
                <p>Etapa {etapa}</p>
                <div className="simbolos-recuadro">
                  {barajaInicial.map((simbolo, index) => (
                    <div key={index} className="simbolo-recuadro">
                      <img src={simbolo} alt={`Símbolo ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Espacio Muestral */}
              <div className="espacio-muestral">
                <h2>Espacio muestral (selecciona los resultados)</h2>
                <div className="resultados">
                  {simbolosEspacioMuestralOrdenados.map((simbolo, index) => (
                    <div 
                      key={index} 
                      className={`simbolo ${espacioMuestral.includes(simbolo) ? 'seleccionado' : ''}`} 
                      onClick={() => handleToggleSeleccion(simbolo)}
                      title="Haz clic para seleccionar/deseleccionar este símbolo"
                    >
                      <img src={simbolo} alt={`Símbolo ${index + 1}`} />
                      {/* Indicador de selección */}
                      {espacioMuestral.includes(simbolo) && <div className="overlay"></div>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="barra-inferior">
                <button onClick={verificarRespuesta}>Comprobar</button>
              </div>
            </div>
          )}

          {/* Retroalimentación */}
          {mostrarRetroalimentacion && (
            <div className="retroalimentacion">
              <p>{mensajeRetroalimentacion}</p>
              <button onClick={cerrarRetroalimentacion}>Intentar de nuevo</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EspacioMuestral;
