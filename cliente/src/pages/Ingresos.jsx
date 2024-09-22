import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import logo from '../assets/col.png'; // Ruta al logo de la carpeta assets

const API_URL = 'http://localhost:4000';

export function Ingresos() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ nombre: '', cantidad: '' });
    const [showDialog, setShowDialog] = useState(false);
    const [dialogType, setDialogType] = useState(''); // 'edit', 'delete', 'add'

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = localStorage.getItem('token');
                const result = await axios.get(`${API_URL}/inventario`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProductos(result.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAdd = () => {
        setDialogType('add');
        setShowDialog(true);
    };

    const handleEdit = (producto) => {
        setSelectedProduct(producto);
        setNewProduct({ nombre: producto.nombre, cantidad: producto.cantidad });
        setDialogType('edit');
        setShowDialog(true);
    };

    const handleDelete = (producto) => {
        setSelectedProduct(producto);
        setDialogType('delete');
        setShowDialog(true);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (dialogType === 'add') {
                await axios.post(`${API_URL}/inventario`, newProduct, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else if (dialogType === 'edit') {
                await axios.put(`${API_URL}/inventario/${selectedProduct.id}`, newProduct, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else if (dialogType === 'delete') {
                await axios.delete(`${API_URL}/inventario/${selectedProduct.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            const result = await axios.get(`${API_URL}/inventario`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProductos(result.data);
            setShowDialog(false);
            setNewProduct({ nombre: '', cantidad: '' });
            setSelectedProduct(null);
        } catch (err) {
            setError(err);
        }
    };

    const handleCancel = () => {
        setShowDialog(false);
        setNewProduct({ nombre: '', cantidad: '' });
        setSelectedProduct(null);
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const filteredProducts = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container>
            <Header>
                <img src={logo} alt="Colgas Logo" />
                <h1>Ingresos</h1>
            </Header>

            <SearchInput
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={handleSearch}
            />

            <AddButton onClick={handleAdd}>Agregar Producto</AddButton>

            <Table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(producto => (
                            <tr key={producto.id}>
                                <td>{producto.id}</td>
                                <td>{producto.nombre}</td>
                                <td>{producto.cantidad}</td>
                                <td>
                                    <ActionButton onClick={() => handleEdit(producto)}>Editar</ActionButton>
                                    <ActionButton onClick={() => handleDelete(producto)}>Eliminar</ActionButton>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay productos disponibles.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {showDialog && (
                <Dialog>
                    <h2>{dialogType === 'add' ? 'Agregar Producto' : dialogType === 'edit' ? 'Editar Producto' : 'Eliminar Producto'}</h2>
                    {dialogType !== 'delete' && (
                        <>
                            <p>Nombre:
                                <DialogInput
                                    type="text"
                                    value={newProduct.nombre}
                                    onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                                />
                            </p>
                            <p>Cantidad:
                                <DialogInput
                                    type="number"
                                    value={newProduct.cantidad}
                                    onChange={(e) => setNewProduct({ ...newProduct, cantidad: e.target.value })}
                                    min="0"
                                />
                            </p>
                        </>
                    )}
                    {dialogType === 'delete' && (
                        <p>¿Estás seguro de que deseas eliminar el producto {selectedProduct.nombre}?</p>
                    )}
                    <DialogButtonContainer>
                        <DialogButton onClick={handleSave}>
                            {dialogType === 'delete' ? 'Eliminar' : 'Guardar'}
                        </DialogButton>
                        <DialogButton onClick={handleCancel}>Cancelar</DialogButton>
                    </DialogButtonContainer>
                </Dialog>
            )}
        </Container>
    );
}

const Container = styled.div`
    height: 100vh;
    width: 100;
    background: ${(props) => props.theme.bg}; /* Fondo principal del contenedor */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
    img {
        width: 130px;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background: ${(props) => props.theme.bg};
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background-color: ${(props) => props.theme.bg3};
    }

    tr:hover {
        background-color: #f1f1f1;
    }
`;

const SearchInput = styled.input`
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const AddButton = styled.button`
    padding: 10px 20px;
    background-color: #007bff; /* Azul */
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 20px;
    align-self: flex-start; /* Botón a la izquierda */

    &:hover {
        background-color: #0056b3;
    }
`;

const ActionButton = styled.button`
    padding: 8px 16px;
    background-color: #007bff; /* Azul */
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;

    &:hover {
        background-color: #0056b3;
    }
`;

const Dialog = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;

    h2 {
        margin-top: 0;
    }

    p {
        margin: 10px 0;
    }
`;

const DialogInput = styled.input`
    padding: 5px;
    margin-left: 10px;
    width: 200px;
`;

const DialogButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
`;

const DialogButton = styled.button`
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

