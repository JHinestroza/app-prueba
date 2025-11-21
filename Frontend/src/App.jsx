import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'sonner';
import './App.css';
import LoginPage from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ExpedientesLista from './pages/ExpedientesLista.jsx';
import ExpedienteNuevo from './pages/ExpedienteNuevo.jsx';
import authService from './services/authService';

// Componente para rutas protegidas
function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/expedientes" 
          element={
            <ProtectedRoute>
              <ExpedientesLista />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/expedientes/nuevo" 
          element={
            <ProtectedRoute>
              <ExpedienteNuevo />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
