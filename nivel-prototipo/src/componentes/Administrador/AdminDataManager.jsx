import React, { useState, useEffect } from "react";
import api from "../../api";
import "./AdminDataManager.css";


const AdminDataManager = () => {
  // Estados para Colegios
  const [colegios, setColegios] = useState([]);
  const [nombreColegio, setNombreColegio] = useState("");
  const [direccionColegio, setDireccionColegio] = useState("");
  const [ciudadColegio, setCiudadColegio] = useState("");

  // Estados para Cursos
  const [cursos, setCursos] = useState([]);
  const [nivelCurso, setNivelCurso] = useState("");
  const [letraCurso, setLetraCurso] = useState("");
  const [colegioIdCurso, setColegioIdCurso] = useState("");

  // Estado para mostrar u ocultar cursos de un colegio
  const [showCourses, setShowCourses] = useState(null);

  // Estados para modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddColegioModalOpen, setIsAddColegioModalOpen] = useState(false);
  const [isAddCursoModalOpen, setIsAddCursoModalOpen] = useState(false);
  const [isEditCursoModalOpen, setIsEditCursoModalOpen] = useState(false);
  const [editingColegio, setEditingColegio] = useState(null);
  const [editingCurso, setEditingCurso] = useState(null);

  // Mensajes de respuesta
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Obtener todos los colegios
    const fetchColegios = async () => {
      try {
        const response = await api.get("/api/administrador/colegios/");
        setColegios(response.data);
      } catch (error) {
        console.error("Error al obtener los colegios:", error);
      }
    };
    fetchColegios();
  }, []);

  const handleShowCourses = async (colegioId) => {
    if (showCourses === colegioId) {
      setShowCourses(null);
    } else {
      try {
        const response = await api.get(
          `/api/administrador/colegios/${colegioId}/cursos/`
        );
        setCursos(response.data);
        setShowCourses(colegioId);
      } catch (error) {
        console.error("Error al obtener los cursos:", error);
      }
    }
  };

  // Manejo de creación de colegios
  const handleCreateColegio = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/administrador/colegios/", {
        nombre: nombreColegio,
        direccion: direccionColegio,
        ciudad: ciudadColegio,
      });
      setColegios([...colegios, response.data]);
      setNombreColegio("");
      setDireccionColegio("");
      setCiudadColegio("");
      setMessage("Colegio creado exitosamente");
      setIsAddColegioModalOpen(false);
    } catch (error) {
      setMessage("Error al crear el colegio");
    }
  };

  // Manejo de edición de colegios
  const handleEditColegio = (colegio) => {
    setEditingColegio(colegio);
    setIsEditModalOpen(true);
  };

  const handleUpdateColegio = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(
        `/api/administrador/colegios/${editingColegio.id}/`,
        {
          nombre: editingColegio.nombre,
          direccion: editingColegio.direccion,
          ciudad: editingColegio.ciudad,
        }
      );
      setColegios(
        colegios.map((colegio) =>
          colegio.id === editingColegio.id ? response.data : colegio
        )
      );
      setEditingColegio(null);
      setIsEditModalOpen(false);
      setMessage("Colegio actualizado exitosamente");
    } catch (error) {
      setMessage("Error al actualizar el colegio");
    }
  };

  // Manejo de eliminación de colegios
  const handleDeleteColegio = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este colegio?")) {
      try {
        await api.delete(`/api/administrador/colegios/${id}/`);
        setColegios(colegios.filter((colegio) => colegio.id !== id));
        setMessage("Colegio eliminado exitosamente");
      } catch (error) {
        setMessage("Error al eliminar el colegio");
      }
    }
  };

  // Manejo de creación de cursos
  const handleCreateCurso = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/administrador/cursos/", {
        nivel: nivelCurso,
        letra: letraCurso,
        colegio: showCourses,
      });
      setCursos([...cursos, response.data]);
      setNivelCurso("");
      setLetraCurso("");
      setMessage("Curso creado exitosamente");
      setIsAddCursoModalOpen(false);
    } catch (error) {
      setMessage("Error al crear el curso");
    }
  };

  // Manejo de edición de cursos
  const handleEditCurso = (curso) => {
    setEditingCurso(curso);
    setIsEditCursoModalOpen(true);
  };

  const handleUpdateCurso = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(
        `/api/administrador/cursos/${editingCurso.id}/`,
        {
          nivel: editingCurso.nivel,
          letra: editingCurso.letra,
          colegio: editingCurso.colegio,
        }
      );
      setCursos(
        cursos.map((curso) =>
          curso.id === editingCurso.id ? response.data : curso
        )
      );
      setEditingCurso(null);
      setIsEditCursoModalOpen(false);
      setMessage("Curso actualizado exitosamente");
    } catch (error) {
      setMessage("Error al actualizar el curso");
    }
  };

  // Manejo de eliminación de cursos
  const handleDeleteCurso = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este curso?")) {
      try {
        await api.delete(`/api/administrador/cursos/${id}/`);
        setCursos(cursos.filter((curso) => curso.id !== id));
        setMessage("Curso eliminado exitosamente");
      } catch (error) {
        setMessage("Error al eliminar el curso");
      }
    }
  };

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Panel de Colegios</h1>
      {message && <p className="admin-message">{message}</p>}

      <button
        className="admin-button primary-button add-school-button"
        onClick={() => setIsAddColegioModalOpen(true)}
      >
        Agregar Colegio
      </button>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Colegio</th>
            <th>Dirección</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {colegios.map((colegio) => (
            <React.Fragment key={colegio.id}>
              <tr>
                <td>{colegio.nombre}</td>
                <td>{colegio.direccion}</td>
                <td>{colegio.ciudad}</td>
                <td>
                  <button
                    className="admin-button primary-button"
                    onClick={() => handleShowCourses(colegio.id)}
                  >
                    Ver Cursos
                  </button>
                  <button
                    className="admin-button edit-button"
                    onClick={() => handleEditColegio(colegio)}
                  >
                    Editar
                  </button>
                  <button
                    className="admin-button danger-button"
                    onClick={() => handleDeleteColegio(colegio.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
              {showCourses === colegio.id && (
                <tr className="course-row">
                  <td colSpan="4">
                    <div className="course-list">
                      <h3>Cursos del Colegio {colegio.nombre}</h3>
                      <button
                        className="admin-button primary-button add-course-button"
                        onClick={() => setIsAddCursoModalOpen(true)}
                      >
                        Agregar Curso
                      </button>
                      <ul>
                        {cursos.map((curso) => (
                          <li key={curso.id} className="admin-list-item">
                            {curso.nivel} {curso.letra}
                            <button
                              className="admin-button edit-button"
                              onClick={() => handleCreateCurso(curso)}
                            >
                              Editar
                            </button>
                            <button
                              className="admin-button danger-button"
                              onClick={() => handleDeleteCurso(curso.id)}
                            >
                              Eliminar
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Modal para agregar colegio */}
      {isAddColegioModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-header">Agregar Colegio</h2>
            <form onSubmit={handleCreateColegio}>
              <input
                type="text"
                value={nombreColegio}
                onChange={(e) => setNombreColegio(e.target.value)}
                placeholder="Nombre del Colegio"
              />
              <input
                type="text"
                value={direccionColegio}
                onChange={(e) => setDireccionColegio(e.target.value)}
                placeholder="Dirección del Colegio"
              />
              <input
                type="text"
                value={ciudadColegio}
                onChange={(e) => setCiudadColegio(e.target.value)}
                placeholder="Ciudad"
              />
              <button type="submit" className="admin-button primary-button">
                Guardar
              </button>
              <button
                type="button"
                className="admin-button danger-button"
                onClick={() => setIsAddColegioModalOpen(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar colegio */}
      {isEditModalOpen && editingColegio && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-header">Editar Colegio</h2>
            <form onSubmit={handleUpdateColegio}>
              <input
                type="text"
                value={editingColegio.nombre}
                onChange={(e) =>
                  setEditingColegio({
                    ...editingColegio,
                    nombre: e.target.value,
                  })
                }
                placeholder="Nombre del Colegio"
              />
              <input
                type="text"
                value={editingColegio.direccion}
                onChange={(e) =>
                  setEditingColegio({
                    ...editingColegio,
                    direccion: e.target.value,
                  })
                }
                placeholder="Dirección del Colegio"
              />
              <input
                type="text"
                value={editingColegio.ciudad}
                onChange={(e) =>
                  setEditingColegio({
                    ...editingColegio,
                    ciudad: e.target.value,
                  })
                }
                placeholder="Ciudad"
              />
              <button type="submit" className="admin-button primary-button">
                Guardar
              </button>
              <button
                type="button"
                className="admin-button danger-button"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para agregar curso */}
      {isAddCursoModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-header">Agregar Curso</h2>
            <form onSubmit={handleCreateCurso}>
              <input
                type="text"
                value={nivelCurso}
                onChange={(e) => setNivelCurso(e.target.value)}
                placeholder="Nivel del Curso"
              />
              <input
                type="text"
                value={letraCurso}
                onChange={(e) => setLetraCurso(e.target.value)}
                placeholder="Letra del Curso"
              />
              <button type="submit" className="admin-button primary-button">
                Guardar
              </button>
              <button
                type="button"
                className="admin-button danger-button"
                onClick={() => setIsAddCursoModalOpen(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar curso */}
      {isEditCursoModalOpen && editingCurso && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-header">Editar Curso</h2>
            <form onSubmit={handleUpdateCurso}>
              <input
                type="text"
                value={editingCurso.nivel}
                onChange={(e) =>
                  setEditingCurso({ ...editingCurso, nivel: e.target.value })
                }
                placeholder="Nivel del Curso"
              />
              <input
                type="text"
                value={editingCurso.letra}
                onChange={(e) =>
                  setEditingCurso({ ...editingCurso, letra: e.target.value })
                }
                placeholder="Letra del Curso"
              />
              <button type="submit" className="admin-button primary-button">
                Guardar
              </button>
              <button
                type="button"
                className="admin-button danger-button"
                onClick={() => setIsEditCursoModalOpen(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDataManager;
