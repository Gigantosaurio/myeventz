import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ComponentsDemo } from './pages/ComponentsDemo';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal - redirige al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Aplicación principal */}
        <Route path="/home" element={<Home />} />
        
        {/* Demo de componentes */}
        <Route path="/demo" element={<ComponentsDemo />} />
        
        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
