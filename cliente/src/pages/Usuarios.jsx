import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const API_URL = 'http://localhost:4000'; // Dirección de conexión

export function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editId, setEditId] = useState(null);
    const [editValues, setEditValues] = useState({ username: '', email: '', role: '' });

    useEffect(() => {
        const loadUsuarios = async () => {
            try {
                const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
                const response = await axios.get(`${API_URL}/usuarios`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsuarios(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadUsuarios();
    }, []);

    const handleEdit = (usuario) => {
        setEditId(usuario.id);
        setEditValues({ username: usuario.username, email: usuario.email, role: usuario.role });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/usuarios/${editId}`, editValues, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const response = await axios.get(`${API_URL}/usuarios`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsuarios(response.data);
            setEditId(null);
        } catch (err) {
            setError(err);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
        if (confirmed) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/usuarios/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const response = await axios.get(`${API_URL}/usuarios`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsuarios(response.data);
            } catch (err) {
                setError(err);
            }
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
            <h1>Usuarios</h1>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.length > 0 ? (
                        usuarios.map(usuario => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>
                                    {editId === usuario.id ? (
                                        <Input
                                            type="text"
                                            name="username"
                                            value={editValues.username}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        usuario.username
                                    )}
                                </td>
                                <td>
                                    {editId === usuario.id ? (
                                        <Input
                                            type="email"
                                            name="email"
                                            value={editValues.email}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        usuario.email
                                    )}
                                </td>
                                <td>
                                    {editId === usuario.id ? (
                                        <Select
                                            name="role"
                                            value={editValues.role}
                                            onChange={handleChange}
                                        >
                                            <option value="administrador">Administrador</option>
                                            <option value="usuario">Usuario</option>
                                        </Select>
                                    ) : (
                                        usuario.role
                                    )}
                                </td>
                                <td>
                                    {editId === usuario.id ? (
                                        <>
                                            <Button onClick={handleSave}>Guardar</Button>
                                            <Button onClick={() => setEditId(null)}>Cancelar</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button onClick={() => handleEdit(usuario)}>Editar</Button>
                                            <Button onClick={() => handleDelete(usuario.id)}>Eliminar</Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay usuarios disponibles.</td>
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
    padding: 20px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    
    th, td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;
    }

    th {
        background-color: #f4f4f4;
    }
    
    td input {
        width: 100%;
        box-sizing: border-box;
    }
`;

const Input = styled.input`
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    box-sizing: border-box;
`;

const Select = styled.select`
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    box-sizing: border-box;
    width: 100%;
`;

const Button = styled.button`
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    margin: 2px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
    
    &:last-child {
        background-color: #dc3545;

        &:hover {
            background-color: #c82333;
        }
    }
`;

