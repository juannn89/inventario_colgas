import axios from 'axios';

const API_URL = 'http://localhost:4000'; // Dirección de conexión

export const fetchInventario = async () => {
    try {
        const response = await axios.get(`${API_URL}/inventario`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener inventario: ' + error.message);
    }
};