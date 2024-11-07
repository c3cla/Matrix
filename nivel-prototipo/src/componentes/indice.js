//ELEMENTOS

//Barra de progeso
export * from "./BarraProgreso/BarraProgreso.jsx";

//ManejoRespuesta
export * from "./ManejoRespuesta/ManejoRespuesta.jsx"

//Resumen de respuestas
export * from "./Resumen/Resumen.jsx"

//Visualización niveles
export { default as MostrarNiveles} from './MostrarNiveles/MostrarNiveles.jsx';
export { default as MapaEtapas} from './MostrarNiveles/MapaEtapas.jsx';
export { default as DetalleEtapas} from './MostrarNiveles/DetalleEtapas.jsx';


//ACTIVIDADES
// Problema pelotas aleatorias 
export * from "./Pelotas/Pelotas.jsx"

// Problema espacio muestral
export { default as EspacioMuestral} from './EspacioMuestral/EspacioMuestral.jsx';

//Problema experimentos y eventos
export {default as ExperimentoEvento} from './ExperimentoEvento/ExperimentoEvento.jsx'


//INICIO DE SESIÓN
export { default as Login } from './Sesion/Login.jsx';
export { default as Register } from "./Sesion/Register.jsx"
export { default as ProtectedRoute } from "./Sesion/ProtectedRoute.jsx";
export { default as NotFound } from './Sesion/NotFound.jsx';
export { default as LoadingIndicator } from './Sesion/LoadingIndicator.jsx';
