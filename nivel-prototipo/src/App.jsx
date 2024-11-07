// src/App.js
import React from "react";
import {
  Login,
  Register,
  MostrarNiveles,
  NotFound,
  ProtectedRoute,
  MapaEtapas,
  DetalleEtapas,
} from "./componentes/indice";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MostrarNiveles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nivel/:id_nivel"
          element={
            <ProtectedRoute>
              <MapaEtapas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/etapa/:id_etapa"
          element={
            <ProtectedRoute>
              <DetalleEtapas />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
