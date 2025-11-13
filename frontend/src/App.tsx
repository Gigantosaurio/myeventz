import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ComponentsDemo } from './pages/ComponentsDemo';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Categories } from './pages/Categories';
import { Search } from './pages/Search';
import { EventDetail } from './pages/EventDetail';
import { CreateEvent } from './pages/CreateEvent';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';
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
        <Route path="/search" element={<Search />} />
        <Route path="/event/:eventId" element={<EventDetail />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        
        {/* Demo de componentes */}
        <Route path="/demo" element={<ComponentsDemo />} />
        
        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
