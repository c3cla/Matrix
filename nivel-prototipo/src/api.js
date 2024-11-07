import axios from "axios"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./componentes/Sesion/Constants"


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});


api.interceptors.request.use(
  (config) => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
      return response;
  },
  async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken = localStorage.getItem(REFRESH_TOKEN);
          if (refreshToken) {
              try {
                  const response = await axios.post(`${api.defaults.baseURL}/api/token/refresh/`, { refresh: refreshToken });
                  localStorage.setItem(ACCESS_TOKEN, response.data.access);
                  axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                  return api(originalRequest);
              } catch (err) {
                  console.error("Error actualizando el token:", err);
                  history.pushState(null, null, "/logout");
                  window.location.reload();
              }
          } else {
              history.pushState(null, null, "/logout");
              window.location.reload();
          }
      }
      return Promise.reject(error);
  }
);

export const obtenerNiveles = async () => {
  try {
    const response = await api.get('/api/niveles/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los niveles:', error);
    return [];
  }
};

export const obtenerEtapasPorNivel = async (id_nivel) => {
  try {
    const response = await api.get('/api/etapas/', {
      params: { id_nivel }, // Filtra las etapas por id_nivel
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener las etapas para el nivel ${id_nivel}:`, error);
    return [];
  }
};


export const obtenerTerminosPareados = async (uso = "experimento") => {
    try {
        const response = await api.get(`/api/terminos_pareados/`, {
            params: { uso }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener los términos pareados:", error);
        return [];
    }
};

export const registrarAvanceEstudiante = async (etapaId, tiempo, logro) => {
  try {
      const response = await api.post("/avance_estudiantes/", {
          etapa: etapaId,
          tiempo: tiempo,
          logro: logro,
      });
      return response.data;
  } catch (error) {
      console.error("Error al registrar el avance del estudiante:", error);
      throw error;
  }
};

export default api
