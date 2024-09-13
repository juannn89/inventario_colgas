import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios'; // Asegúrate de importar axios
import { fetchSolicitudes } from '../utils/api'; // Asegúrate de usar la ruta correcta para tu archivo de API

const API_URL = 'http://localhost:4000'; // Define la URL de la API aquí si no está en api.js

export function Aprobaciones() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSolicitudes = async () => {
            try {
                const result = await fetchSolicitudes();
                setSolicitudes(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadSolicitudes();
    }, []);

    const handleApprove = async (solicitudId) => {
        try {
            const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
            await axios.put(`${API_URL}/solicitudes/${solicitudId}/approve`, {}, {
                headers: {
                    Authorization: `Bearer ${token}` // Incluir el token en el encabezado
                }
            });
            setSolicitudes(prevSolicitudes =>
                prevSolicitudes.filter(solicitud => solicitud.id !== solicitudId)
            );
        } catch (err) {
            console.error('Error al aprobar la solicitud:', err.response ? err.response.data : err.message);
            setError(err);
        }
    };

    const handleReject = async (solicitudId, productoId, cantidad) => {
        try {
            const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local

            // Primero rechaza la solicitud
            await axios.put(`${API_URL}/solicitudes/${solicitudId}/reject`, {}, {
                headers: {
                    Authorization: `Bearer ${token}` // Incluir el token en el encabezado
                }
            });

            // Luego, reintegra la cantidad al inventario
            if (productoId) {  // Asegúrate de que productoId esté definido
                await axios.put(`${API_URL}/inventario/${productoId}/add`, { cantidad }, {
                    headers: {
                        Authorization: `Bearer ${token}` // Incluir el token en el encabezado
                    }
                });
            } else {
                console.error('ID del producto no está definido');
            }

            // Actualiza el estado de solicitudes
            setSolicitudes(prevSolicitudes =>
                prevSolicitudes.filter(solicitud => solicitud.id !== solicitudId)
            );
        } catch (err) {
            console.error('Error al rechazar la solicitud:', err.response ? err.response.data : err.message);
            setError(err);
        }
    };

    if (loading) return <p>Cargando solicitudes...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <Container>
            <h1>Aprobaciones</h1>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Usuario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {solicitudes.map(solicitud => (
                        <tr key={solicitud.id}>
                            <td>{solicitud.id}</td>
                            <td>{solicitud.producto}</td>
                            <td>{solicitud.cantidad}</td>
                            <td>{solicitud.usuario}</td>
                            <td>
                                <Button onClick={() => handleApprove(solicitud.id)}>Aceptar</Button>
                                <Button onClick={() => handleReject(solicitud.id, solicitud.producto_id, solicitud.cantidad)}>Rechazar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

const Container = styled.div`
    height: 100%;
    width: 100%;
    background: ${(props) => props.theme.bg3};
    padding: 2% 5%;
    box-sizing: border-box;

    h1 {
        text-align: center;
        margin-bottom: 20px;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background-color: #f4f4f4;
    }

    tr:hover {
        background-color: #f1f1f1;
    }
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;

    &:hover {
        background-color: #218838;
    }
`;
