#!/bin/bash

echo "🚀 MyEventz - Script de instalación"
echo "===================================="
echo ""

# Colores./i    
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para instalar frontend
install_frontend() {
    echo -e "${BLUE}📦 Instalando dependencias del Frontend...${NC}"
    cd frontend
    npm install
    cd ..
    echo -e "${GREEN}✅ Frontend instalado correctamente${NC}"
    echo ""
}

# Función para instalar backend
install_backend() {
    echo -e "${BLUE}📦 Instalando dependencias del Backend...${NC}"
    cd backend
    npm install
    cd ..
    echo -e "${GREEN}✅ Backend instalado correctamente${NC}"
    echo ""
}

# Función para crear archivos .env
create_env_files() {
    echo -e "${BLUE}📝 Creando archivos de configuración...${NC}"
    
    # Frontend .env
    if [ ! -f "frontend/.env" ]; then
        cp frontend/.env.example frontend/.env
        echo -e "${GREEN}✅ Creado frontend/.env${NC}"
    else
        echo -e "⚠️  frontend/.env ya existe, saltando..."
    fi
    
    echo ""
}

# Menú principal
echo "Selecciona una opción:"
echo "1) Instalar todo (Frontend + Backend)"
echo "2) Solo Frontend"
echo "3) Solo Backend"
echo "4) Crear archivos .env"
echo "5) Salir"
echo ""
read -p "Opción: " option

case $option in
    1)
        install_frontend
        install_backend
        create_env_files
        echo -e "${GREEN}✨ ¡Instalación completa!${NC}"
        echo ""
        echo "Para iniciar el proyecto:"
        echo "  Frontend: cd frontend && npm run dev"
        echo "  Backend:  cd backend && npm run dev"
        ;;
    2)
        install_frontend
        create_env_files
        echo ""
        echo "Para iniciar: cd frontend && npm run dev"
        ;;
    3)
        install_backend
        echo ""
        echo "Para iniciar: cd backend && npm run dev"
        ;;
    4)
        create_env_files
        ;;
    5)
        echo "Saliendo..."
        exit 0
        ;;
    *)
        echo "Opción inválida"
        exit 1
        ;;
esac
