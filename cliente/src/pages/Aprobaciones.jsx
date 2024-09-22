import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { fetchSolicitudes } from '../utils/api';
import logo from '../assets/col.png';

const API_URL = 'http://localhost:4000';

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
            const token = localStorage.getItem('token');
    
            await axios.put(`${API_URL}/solicitudes/${solicitudId}/approve`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
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
            const token = localStorage.getItem('token');
    
            // Primero, rechazar la solicitud
            const response = await axios.put(`${API_URL}/solicitudes/${solicitudId}/reject`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                // Luego, verificar y actualizar el inventario
                if (productoId && cantidad) {
                    await axios.put(`${API_URL}/inventario/${productoId}/add`, { cantidad }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                } else {
                    console.error('ID del producto o cantidad no están definidos');
                    throw new Error('ID del producto o cantidad no están definidos');
                }
            }

            // Filtrar la solicitud rechazada
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
            <Header>
                <Logo src={logo} alt="Logo COLGAS" />
                <h1>Aprobaciones</h1>
            </Header>
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
                                <Button danger onClick={() => handleReject(solicitud.id, solicitud.producto_id, solicitud.cantidad)}>Rechazar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

// Estilos (Container, Header, Logo, Table y Button deben ser definidos aquí)


const Container = styled.div`
    height: 100vh;
    width: 100%;
    background: ${(props) => props.theme.bg};
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
    overflow-x: hidden;
`;

const Header = styled.header`
    width: 100%;
    max-width: 600px;
    background: ${(props) => props.theme.bg};
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #e0e0e0;
    box-sizing: border-box;

    h1 {
        margin-left: 0;
    }
`;

const Logo = styled.img`
    width: 130px;
    height: auto;
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
    background-color: ${(props) => props.danger ? '#dc3545' : '#007bff'};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;

    &:hover {
        background-color: ${(props) => props.danger ? '#c82333' : '#0056b3'};
    }
`;
