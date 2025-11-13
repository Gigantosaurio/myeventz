/**
 * Construye la URL completa para una imagen
 * El backend sirve las imágenes desde /uploads/
 */
export const getImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;

  // Si ya es una URL completa, devolverla tal cual
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Si es una ruta relativa, construir la URL completa
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace('/api', ''); // Quitar /api para obtener la base

  // Asegurar que la ruta comienza con /
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  return `${baseUrl}${path}`;
};

/**
 * Construye la URL para una imagen de perfil
 */
export const getProfileImageUrl = (imagePath: string | undefined): string | undefined => {
  return getImageUrl(imagePath);
};

/**
 * Construye la URL para una imagen de evento
 */
export const getEventImageUrl = (imagePath: string | undefined): string | undefined => {
  return getImageUrl(imagePath);
};
