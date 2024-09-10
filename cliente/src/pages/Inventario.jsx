import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { fetchInventario } from '../utils/api';

const API_URL = 'http://localhost:4000';

export function Inventario() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editId, setEditId] = useState(null);
    const [editValues, setEditValues] = useState({ nombre: '', cantidad: '' });

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchInventario();
                setData(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleEdit = (item) => {
        setEditId(item.id);
        setEditValues({ nombre: item.nombre, cantidad: item.cantidad });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token'); // Obtener el token almacenado
            await axios.put(`${API_URL}/inventario/${editId}`, editValues, {
                headers: {
                    Authorization: `Bearer ${token}` // Asegúrate de enviar el token en el header
                }
            });
            const result = await fetchInventario(); // Refrescar los datos después de la actualización
            setData(result);
            setEditId(null);
        } catch (err) {
            setError(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditValues({ ...editValues, [name]: value });
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <Container>
            <h1>Inventario</h1>
            <Table>
                <thead>
                    <tr>
                        <th>Consecutivo</th>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>
                                    {editId === item.id ? (
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={editValues.nombre}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        item.nombre
                                    )}
                                </td>
                                <td>
                                    {editId === item.id ? (
                                        <input
                                            type="number"
                                            name="cantidad"
                                            value={editValues.cantidad}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        item.cantidad
                                    )}
                                </td>
                                <td>
                                    {editId === item.id ? (
                                        <>
                                            <button onClick={handleSave}>Guardar</button>
                                            <button onClick={() => setEditId(null)}>Cancelar</button>
                                        </>
                                    ) : (
                                        <button onClick={() => handleEdit(item)}>Editar</button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay datos disponibles.</td>
                        </tr>
                    )}
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

    input {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        margin-right: 8px;
        cursor: pointer;
        background-color: #007bff;
        color: #fff;
        font-size: 14px;
    }

    button:hover {
        background-color: #0056b3;
    }
`;