import axios from 'axios';

const API_URL = 'http://localhost:4000'; // Dirección de conexión

export const fetchInventario = async () => {
    const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local

    try {
        const response = await axios.get(`${API_URL}/inventario`, {
            headers: {
                Authorization: `Bearer ${token}` // Incluye el token en los encabezados
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener inventario: ' + error.message);
    }
};
