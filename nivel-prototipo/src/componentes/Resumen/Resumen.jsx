import React, { useEffect } from "react";
import "./Resumen.css";
import ResumenAnimacion from "../assets/wow.gif";
import RepetirIcono from "../assets/repetir.png";
import ContinuarIcono from "../assets/continuar.png";
import PropTypes from "prop-types";
import api from "../../api"; 

export const Resumen = ({
  resultados,
  tiempoTotal,
  totalPreguntas,
  reiniciarQuiz,
  continuarQuiz,
}) => {
  // Calcular porcentaje de logro
  const calcularPorcentajeCorrectas = () => {
    const correctas = resultados.filter((r) => r.correcta).length;
    return ((correctas * 100) / totalPreguntas).toFixed(0);
  };

  const porcentajeLogro = calcularPorcentajeCorrectas();

  // Formatear tiempo en formato hh:mm:ss
  const formatearTiempo = (tiempoEnSegundos) => {
    const horas = Math.floor(tiempoEnSegundos / 3600);
    const minutos = Math.floor((tiempoEnSegundos % 3600) / 60);
    const segundos = Math.floor(tiempoEnSegundos % 60);
    return [horas, minutos, segundos]
      .map((unidad) => String(unidad).padStart(2, "0"))
      .join(":");
  };

  // Guardar avance del estudiante cuando se monta el componente Resumen
  useEffect(() => {
    const registrarAvance = async () => {
      try {
        await api.post("/avance-estudiantes/", {
          etapa: 1, // Aquí debes pasar el ID de la etapa actual
          tiempo: tiempoTotal,
          logro: porcentajeLogro,
        });
        console.log("Avance registrado exitosamente.");
      } catch (error) {
        console.error("Error al registrar el avance:", error);
      }
    };

    registrarAvance();
  }, [tiempoTotal, porcentajeLogro]);

  return (
    <div className="resumen-overlay">
      <div className="resumen-contenedor">
        <div className="animacion">
          <img src={ResumenAnimacion} alt="Animación de resumen" />
        </div>

        <div className="resumen-tabla">
          <h2>Preguntas</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tiempo</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((resultado, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{formatearTiempo(resultado.tiempo)}</td>
                  <td>
                    {resultado.correcta ? (
                      <span
                        className="icono-correcto"
                        role="img"
                        aria-label="Correcto"
                      >
                        ✔️
                      </span>
                    ) : (
                      <span
                        className="icono-incorrecto"
                        role="img"
                        aria-label="Incorrecto"
                      >
                        ❌
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td>{formatearTiempo(tiempoTotal)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Porcentaje de logro */}
        <div className="resumen-porcentaje">
          <h2>Porcentaje de logro: {porcentajeLogro}%</h2>
        </div>

        {/* Botones */}
        <div className="resumen-botones">
          <button className="boton-repetir" onClick={reiniciarQuiz}>
            Repetir
            <img src={RepetirIcono} alt="" aria-hidden="true" />
          </button>
          <button className="boton-continuar" onClick={continuarQuiz}>
            Continuar
            <img src={ContinuarIcono} alt="" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

Resumen.propTypes = {
  resultados: PropTypes.arrayOf(
    PropTypes.shape({
      correcta: PropTypes.bool.isRequired,
      tiempo: PropTypes.number.isRequired,
    })
  ).isRequired,
  tiempoTotal: PropTypes.number.isRequired,
  totalPreguntas: PropTypes.number.isRequired,
  reiniciarQuiz: PropTypes.func.isRequired,
  continuarQuiz: PropTypes.func.isRequired,
};
