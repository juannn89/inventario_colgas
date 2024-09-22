import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import logo from '../assets/col.png'; // Importa el logo

const API_URL_SOLICITUDES = 'http://localhost:4000/informes';
const API_URL_USUARIOS = 'http://localhost:4000/usuarios';

export function Informes() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchProduct, setSearchProduct] = useState('');
    const [searchUser, setSearchUser] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = localStorage.getItem('token');

                const resultSolicitudes = await axios.get(API_URL_SOLICITUDES, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSolicitudes(resultSolicitudes.data);

                const resultUsuarios = await axios.get(API_URL_USUARIOS, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsuarios(resultUsuarios.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        if (solicitudes.length > 0 && usuarios.length > 0) {
            const solicitudesConUsuario = solicitudes.map(solicitud => {
                const usuario = usuarios.find(usuario => usuario.id === solicitud.usuario_id);
                const fechaSolicitud = formatDate(solicitud.fecha_solicitud);

                return {
                    ...solicitud,
                    usuarioNombre: usuario ? usuario.username : 'Desconocido',
                    fecha_solicitud: fechaSolicitud
                };
            });

            setFilteredSolicitudes(
                solicitudesConUsuario.filter(solicitud =>
                    (solicitud.producto_nombre?.toLowerCase().includes(searchProduct.toLowerCase()) || !searchProduct) &&
                    (solicitud.usuarioNombre.toLowerCase().includes(searchUser.toLowerCase()) || !searchUser) &&
                    (searchDate ? solicitud.fecha_solicitud === searchDate : true) &&
                    (searchStatus ? solicitud.estado.toLowerCase() === searchStatus.toLowerCase() : true)
                )
            );
        }
    }, [searchProduct, searchUser, searchDate, searchStatus, solicitudes, usuarios]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSearchProduct = (e) => setSearchProduct(e.target.value);
    const handleSearchUser = (e) => setSearchUser(e.target.value);
    const handleSearchDate = (e) => setSearchDate(e.target.value);
    const handleSearchStatus = (e) => setSearchStatus(e.target.value);

    const handlePageChange = (newPage) => setCurrentPage(newPage);

    const paginatedSolicitudes = filteredSolicitudes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Informes', 14, 16);
        
        const tableColumn = ["Producto", "Cantidad", "Usuario", "Fecha", "Estado"];
        const tableRows = [];

        paginatedSolicitudes.forEach(solicitud => {
            const solicitudData = [
                solicitud.producto_nombre,
                solicitud.cantidad,
                solicitud.usuarioNombre,
                solicitud.fecha_solicitud,
                solicitud.estado
            ];
            tableRows.push(solicitudData);
        });

        doc.autoTable(tableColumn, tableRows, { startY: 22 });
        doc.save('informes.pdf');
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredSolicitudes.map(solicitud => ({
            Producto: solicitud.producto_nombre,
            Cantidad: solicitud.cantidad,
            Usuario: solicitud.usuarioNombre,
            Fecha: solicitud.fecha_solicitud,
            Estado: solicitud.estado
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Informes');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(file, 'informes.xlsx');
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <Container>
            <Header>
                <Logo src={logo} alt="Logo COLGAS" />
                <h1>Informes</h1>
            </Header>

            <SearchInput
                type="text"
                placeholder="Buscar por producto..."
                value={searchProduct}
                onChange={handleSearchProduct}
            />

            <SearchInput
                type="text"
                placeholder="Buscar por usuario..."
                value={searchUser}
                onChange={handleSearchUser}
            />

            <SearchInput
                type="date"
                placeholder="Buscar por fecha..."
                value={searchDate}
                onChange={handleSearchDate}
            />

            <SearchInput
                type="text"
                placeholder="Buscar por estado (aprobada/rechazada)..."
                value={searchStatus}
                onChange={handleSearchStatus}
            />

            <ButtonsContainer>
                <ExportButton onClick={exportToPDF}>Exportar a PDF</ExportButton>
                <ExportButton onClick={exportToExcel}>Exportar a Excel</ExportButton>
            </ButtonsContainer>

            <Table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Usuario</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedSolicitudes.length > 0 ? (
                        paginatedSolicitudes.map((solicitud) => (
                            <tr key={solicitud.id}>
                                <td>{solicitud.producto_nombre}</td>
                                <td>{solicitud.cantidad}</td>
                                <td>{solicitud.usuarioNombre}</td>
                                <td>{solicitud.fecha_solicitud}</td>
                                <td>{solicitud.estado}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay datos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Pagination>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <span>Página {currentPage}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage * itemsPerPage >= filteredSolicitudes.length}
                >
                    Siguiente
                </button>
            </Pagination>
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
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
    overflow-x: hidden; /* Evitar scroll horizontal */

    h1 {
        text-align: center;
        margin-bottom: 20px;
    }
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
    h1 {
        margin-left: 10px;
    }
`;

const Logo = styled.img`
    width: 130px; /* Ajusta el tamaño según sea necesario */
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

const SearchInput = styled.input`
    display: block;
    width: 100%;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

const ButtonsContainer = styled.div`
    margin-bottom: 20px;
`;

const ExportButton = styled.button`
    margin-right: 10px;
    padding: 10px 15px;
    background-color: #007BFF; /* Color azul */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3; /* Color azul más oscuro al pasar el mouse */
    }
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;

    button {
        padding: 10px;
        margin: 0 5px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: #007BFF; /* Color azul */
        color: white;

        &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        &:hover:not(:disabled) {
            background-color: #0056b3; /* Color azul más oscuro al pasar el mouse */
        }
    }
`;
