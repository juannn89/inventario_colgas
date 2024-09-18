import axios from 'axios';

const API_URL = 'http://localhost:4000'; // Dirección de conexión

// Función para obtener el inventario
export const fetchInventario = async () => {
    const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local

    if (!token) {
        throw new Error('Token no encontrado en el almacenamiento local');
    }

    console.log('Token:', token);

    try {
        const response = await axios.get(`${API_URL}/inventario`, {
            headers: {
                Authorization: `Bearer ${token}` // Incluye el token en los encabezados
            }
        });
        console.log('Inventario recibido:', response.data); // Verifica la estructura de los datos
        return response.data;
    } catch (error) {
        console.error('Error al obtener inventario:', error.response?.data || error.message);
        throw new Error('Error al obtener inventario: ' + error.message);
    }
};

// Función para obtener las solicitudes
export const fetchSolicitudes = async (estado) => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Token no encontrado en el almacenamiento local');
    }

    console.log('Token:', token);

    try {
        // Construir la URL con el parámetro de estado si está presente
        const url = estado ? `${API_URL}/solicitudes?estado=${estado}` : `${API_URL}/solicitudes`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Solicitudes recibidas:', response.data); // Verifica la estructura de los datos
        return response.data;
    } catch (error) {
        console.error('Error al obtener solicitudes:', error.response?.data || error.message);
        throw new Error('Error al obtener solicitudes: ' + error.message);
    }
};