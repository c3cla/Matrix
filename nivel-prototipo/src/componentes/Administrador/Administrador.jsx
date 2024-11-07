import React, { useState } from "react";
import AdminDataManager from "./AdminDataManager";

const Administrador = () => {
  const [isAdminDataManagerVisible, setAdminDataManagerVisible] = useState(false);

  const toggleAdminDataManager = () => {
    setAdminDataManagerVisible(!isAdminDataManagerVisible);
  };

  return (
    <div>
      <h1>Panel de Administrador</h1>
      <button onClick={toggleAdminDataManager}>
        {isAdminDataManagerVisible ? "Ocultar Panel Colegios" : "Mostrar Panel Colegios"}
      </button>
      {isAdminDataManagerVisible && <AdminDataManager />}
    </div>
  );
};

export default Administrador;
