import { Button, Input, Card, Logo, Tag } from '../components/common';
import { Mail, Lock, Search } from 'lucide-react';
import './ComponentsDemo.css';

export const ComponentsDemo = () => {
  return (
    <div className="demo-container">
      <div className="demo-section">
        <h1>MyEventz - Sistema de Componentes</h1>
        <p className="demo-subtitle">Demostración de componentes base</p>
      </div>

      {/* Logo */}
      <div className="demo-section">
        <h2>Logo</h2>
        <div className="demo-grid">
          <div>
            <p className="demo-label">Pequeño</p>
            <Logo size="sm" />
          </div>
          <div>
            <p className="demo-label">Mediano</p>
            <Logo size="md" />
          </div>
          <div>
            <p className="demo-label">Grande</p>
            <Logo size="lg" />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="demo-section">
        <h2>Buttons</h2>
        <div className="demo-grid">
          <div>
            <p className="demo-label">Primary</p>
            <Button variant="primary">Button Primary</Button>
          </div>
          <div>
            <p className="demo-label">Secondary</p>
            <Button variant="secondary">Button Secondary</Button>
          </div>
          <div>
            <p className="demo-label">Outline</p>
            <Button variant="outline">Button Outline</Button>
          </div>
          <div>
            <p className="demo-label">Ghost</p>
            <Button variant="ghost">Button Ghost</Button>
          </div>
        </div>

        <h3>Tamaños</h3>
        <div className="demo-grid">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>

        <h3>Estados</h3>
        <div className="demo-grid">
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button fullWidth>Full Width</Button>
        </div>
      </div>

      {/* Inputs */}
      <div className="demo-section">
        <h2>Inputs</h2>
        <div className="demo-grid demo-grid-cols-2">
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            icon={<Mail size={20} />}
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={20} />}
          />
          <Input
            label="Búsqueda"
            type="text"
            placeholder="Buscar eventos..."
            icon={<Search size={20} />}
          />
          <Input
            label="Con error"
            type="text"
            placeholder="Campo con error"
            error="Este campo es requerido"
          />
          <Input
            label="Fecha"
            type="date"
          />
          <Input
            label="Con helper text"
            type="text"
            placeholder="Username"
            helperText="Mínimo 4 caracteres"
          />
        </div>
      </div>

      {/* Cards */}
      <div className="demo-section">
        <h2>Cards</h2>
        <div className="demo-grid demo-grid-cols-3">
          <Card>
            <h3>Card Simple</h3>
            <p>Contenido de la tarjeta básica</p>
          </Card>
          <Card hover clickable>
            <h3>Card con Hover</h3>
            <p>Pasa el mouse por encima</p>
          </Card>
          <Card padding="lg">
            <h3>Card con Padding Large</h3>
            <p>Más espacio interno</p>
          </Card>
        </div>
      </div>

      {/* Tags */}
      <div className="demo-section">
        <h2>Tags / Categorías</h2>
        <div className="demo-tags-container">
          <Tag color="#8b5cf6">Audiovisual</Tag>
          <Tag color="#ec4899">Baloncesto</Tag>
          <Tag color="#f59e0b">Calistenia</Tag>
          <Tag color="#10b981">Ciclismo</Tag>
          <Tag color="#ef4444">Cocina</Tag>
          <Tag color="#3b82f6">Crossfit</Tag>
          <Tag color="#f43f5e">Danza</Tag>
          <Tag color="#8b5cf6" selected>Escalada (Seleccionado)</Tag>
          <Tag color="#22c55e">Fútbol</Tag>
          <Tag color="#14b8a6">Golf</Tag>
        </div>

        <h3>Tags Clickables</h3>
        <div className="demo-tags-container">
          <Tag color="#8b5cf6" onClick={() => alert('Click en tag')}>
            Click me
          </Tag>
          <Tag color="#ec4899" onClick={() => alert('Click en tag')}>
            Click me
          </Tag>
          <Tag color="#10b981" onClick={() => alert('Click en tag')}>
            Click me
          </Tag>
        </div>
      </div>

      {/* Ejemplo de formulario completo */}
      <div className="demo-section">
        <h2>Ejemplo: Formulario de Login</h2>
        <Card style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Logo size="lg" />
            <h2 style={{ marginTop: '1rem' }}>¡Bienvenido!</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Tu portal de actividades y experiencias en Zaragoza.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input
              label="Nombre de usuario"
              type="text"
              placeholder="mangelrogel420"
              icon={<Mail size={20} />}
              fullWidth
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={20} />}
              fullWidth
            />
            <Button fullWidth size="lg">
              Iniciar Sesión
            </Button>
            <Button variant="ghost" fullWidth>
              Crear Una Nueva Cuenta
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
