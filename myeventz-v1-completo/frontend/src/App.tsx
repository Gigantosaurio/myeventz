import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ComponentsDemo } from './pages/ComponentsDemo';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Categories } from './pages/Categories';
import { EventSearch } from './pages/EventSearch';
import { EventDetail } from './pages/EventDetail';
import { CreateEvent } from './pages/CreateEvent';
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
        
        {/* Aplicación principal con sidebar */}
        <Route path="/home" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:categoryName" element={<div>Eventos de categoría - Por implementar</div>} />
        <Route path="/search" element={<EventSearch />} />
        <Route path="/event/:eventId" element={<EventDetail />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/users" element={<UserSearch />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/profile/edit" element={<div>Editar perfil - Por implementar</div>} />
        
        {/* Demo de componentes */}
        <Route path="/demo" element={<ComponentsDemo />} />
        
        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
