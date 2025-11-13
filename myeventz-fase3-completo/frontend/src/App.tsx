import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ComponentsDemo } from './pages/ComponentsDemo';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { UserSearch } from './pages/UserSearch';
import { Profile } from './pages/Profile';
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
        <Route path="/search" element={<div>Búsqueda de eventos - En construcción</div>} />
        <Route path="/create-event" element={<div>Crear evento - En construcción</div>} />
        <Route path="/users" element={<UserSearch />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/event/:eventId" element={<div>Detalle del evento - En construcción</div>} />
        
        {/* Demo de componentes */}
        <Route path="/demo" element={<ComponentsDemo />} />
        
        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
