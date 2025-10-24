export async function fetchNews() {
  try {
    const response = await fetch('/api/misteria/news');
    if (!response.ok) {
      throw new Error('Error al obtener las noticias');
    }
    const data = await response.json();
    return data.slice(0, 50); // solo las 50 primeras
  } catch (error) {
    console.error('Error al cargar noticias:', error);
    return [];
  }
}