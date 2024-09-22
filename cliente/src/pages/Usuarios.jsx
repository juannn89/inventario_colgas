import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import logo from '../assets/col.png'; // Importar el logo

const API_URL = 'http://localhost:4000'; // Dirección de conexión

export function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editId, setEditId] = useState(null);
    const [editValues, setEditValues] = useState({ username: '', email: '', role: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Cargar usuarios
    useEffect(() => {
        const loadUsuarios = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Token no disponible');

                const response = await axios.get(`${API_URL}/usuarios`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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

    // Manejar la edición de usuario
    const handleEdit = (usuario) => {
        setEditId(usuario.id);
        setEditValues({ username: usuario.username, email: usuario.email, role: usuario.role });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no disponible');

            await axios.put(`${API_URL}/usuarios/${editId}`, editValues, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const response = await axios.get(`${API_URL}/usuarios`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
                if (!token) throw new Error('Token no disponible');

                await axios.delete(`${API_URL}/usuarios/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const response = await axios.get(`${API_URL}/usuarios`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsuarios(response.data);
            } catch (err) {
                setError(err);
            }
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const filteredUsuarios = usuarios.filter((usuario) =>
        usuario.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginación
    const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
    const paginatedUsuarios = filteredUsuarios.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <Container>
            {/* Logo y título en el mismo estilo que la página de inventario */}
            <Header>
                <Logo src={logo} alt="Logo COLGAS" />
                <h2>Usuarios del Sistema</h2>
            </Header>

            {/* Campo de búsqueda */}
            <SearchInput
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={handleSearch}
            />

            {/* Tabla de usuarios */}
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
                    {paginatedUsuarios.length > 0 ? (
                        paginatedUsuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>
                                    {editId === usuario.id ? (
                                        <Input
                                            type="text"
                                            name="username"
                                            value={editValues.username}
                                            onChange={(e) =>
                                                setEditValues({
                                                    ...editValues,
                                                    username: e.target.value,
                                                })
                                            }
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
                                            onChange={(e) =>
                                                setEditValues({
                                                    ...editValues,
                                                    email: e.target.value,
                                                })
                                            }
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
                                            onChange={(e) =>
                                                setEditValues({
                                                    ...editValues,
                                                    role: e.target.value,
                                                })
                                            }
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

            {/* Botones de paginación */}
            <Pagination>
                <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Anterior
                </Button>
                <span>Página {currentPage} de {totalPages}</span>
                <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Siguiente
                </Button>
            </Pagination>
        </Container>
    );
}

// Estilos
const Container = styled.div`
    height: 100vh;
    width: 100;
    background: ${(props) => props.theme.bg}; /* Fondo principal del contenedor */
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
    overflow-x: hidden; /* Evitar scroll horizontal */
`;

const Header = styled.header`
    width: 100%;
    max-width: 600px;
    background: ${(props) => props.theme.bg}; /* Fondo del encabezado */
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #e0e0e0;
    box-sizing: border-box;
`;

const Logo = styled.img`
    height: 60px;
    margin-right: 20px;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 10px;
    margin-top: 20px;
    font-size: 16px;
    box-sizing: border-box;
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
        background-color: ${(props) => props.theme.bg3};
    }
`;

const Input = styled.input`
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    width: 100%;
    box-sizing: border-box;
`;

const Select = styled.select`
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    width: 100%;
    box-sizing: border-box;
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

const Pagination = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
`;

