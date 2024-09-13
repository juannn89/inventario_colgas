import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { fetchInventario } from '../utils/api';

const API_URL = 'http://localhost:4000';

export function Inventario() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [showDialog, setShowDialog] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchInventario();
                setProductos(result);
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
        setCurrentPage(1); // Reset to first page on search
    };

    const handleRequest = (producto) => {
        setSelectedProduct(producto);
        setShowDialog(true);
    };

    const handleSubmitRequest = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/solicitudes`, {
                producto_id: selectedProduct.id,
                cantidad: quantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                const updatedData = productos.map(item => 
                    item.id === selectedProduct.id ? { ...item, cantidad: item.cantidad - quantity } : item
                );
                setProductos(updatedData);
                setMensaje('Solicitud enviada con éxito');
            } else {
                setMensaje('Error al enviar la solicitud');
            }
            setShowDialog(false);
            setQuantity(0);
            setSelectedProduct(null);
        } catch (err) {
            setError(err);
            setMensaje('Error al enviar la solicitud');
            setShowDialog(false);
            setQuantity(0);
            setSelectedProduct(null);
        }
    };

    const handleCancelRequest = () => {
        setShowDialog(false);
        setQuantity(0);
        setSelectedProduct(null);
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const filteredProducts = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
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

    return (
        <Container>
            <h1>Inventario</h1>

            {/* Campo de búsqueda */}
            <SearchInput
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={handleSearch}
            />

            {/* Tabla de inventario */}
            <Table>
                <thead>
                    <tr>
                        <th>Código</th> {/* Nueva columna para el ID */}
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedProducts.length > 0 ? (
                        paginatedProducts.map(producto => (
                            <tr key={producto.id}>
                                <td>{producto.id}</td> {/* Mostrar el ID como Código */}
                                <td>{producto.nombre}</td>
                                <td>{producto.cantidad}</td>
                                <td>
                                    <Button onClick={() => handleRequest(producto)}>Solicitar</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay productos disponibles.</td> {/* Ajustar el colspan */}
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Botones de paginación */}
            <Pagination>
                <Button onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</Button>
                <span>Página {currentPage} de {totalPages}</span>
                <Button onClick={handleNextPage} disabled={currentPage === totalPages}>Siguiente</Button>
            </Pagination>

            {/* Diálogo de confirmación */}
            {showDialog && (
                <Dialog>
                    <h2>Confirmar Solicitud</h2>
                    <p>Producto: {selectedProduct.nombre}</p>
                    <p>Cantidad: 
                        <input 
                            type="number" 
                            value={quantity} 
                            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                            min="1" 
                        />
                    </p>
                    <Button onClick={handleSubmitRequest}>Aceptar</Button>
                    <Button onClick={handleCancelRequest}>Cancelar</Button>
                </Dialog>
            )}

            {/* Mensaje de éxito o error */}
            {mensaje && <p>{mensaje}</p>}
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

const SearchInput = styled.input`
    display: block;
    width: 100%;
    margin-bottom: 20px;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #218838;
    }

    &:disabled {
        background-color: #ddd;
        cursor: not-allowed;
    }
`;

const Pagination = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    span {
        align-self: center;
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

    input {
        padding: 5px;
        margin-left: 10px;
        width: 60px;
    }
`;
