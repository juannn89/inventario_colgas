import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/col.png'; 

export function Inicio() {
    const [userInfo, setUserInfo] = useState({ name: '', role: '' });
    const [functions, setFunctions] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setUserInfo({ 
                    name: decodedToken.name || 'Desconocido', 
                    role: decodedToken.role || 'Sin rol' 
                });

                if (decodedToken.role === 'administrador') {
                    setFunctions([
                        { name: 'Gestionar Inventario', path: '/inventario' },
                        { name: 'Aprobar Solicitudes', path: '/aprobaciones' },
                        { name: 'Ver Informes', path: '/informes' },
                        { name: 'Gestionar Usuarios', path: '/usuarios' }
                    ]);
                } else {
                    setFunctions([
                        { name: 'Ver Inventario', path: '/inventario' },
                        { name: 'Solicitar Aprobaciones', path: '/solicitudes' },
                        { name: 'Ver Informes', path: '/informes' }
                    ]);
                }
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                setUserInfo({ name: 'Desconocido', role: 'Sin rol' });
            }
        } else {
            setUserInfo({ name: 'Desconocido', role: 'Sin rol' });
        }
    }, []);

    return (
        <Container>
            <Header>
                <Logo src={logo} alt="Logo de COLGAS" />
                <h2>Sistema de inventario COLGAS</h2>
            </Header>
            <Content>
                <h3>{userInfo.name}</h3>
                <h3>Tu rol: {userInfo.role}.</h3>
                <h3>Funciones permitidas:</h3>
                <Menu>
                    {functions.map((func, index) => (
                        <MenuItem key={index}>
                            <StyledLink to={func.path}>{func.name}</StyledLink>
                        </MenuItem>
                    ))}
                </Menu>
            </Content>
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
    padding: 0 10px;
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
    width: 140px;
    margin-bottom: 10px;
    box-sizing: border-box;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 500px;
    background: ${(props) => props.theme.bg}; /* Fondo del contenido */
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e0e0e0;
    box-sizing: border-box;
`;

const Menu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

const MenuItem = styled.div`
    margin: 5px 0;
    width: 100%;
    display: flex;
    justify-content: center;
`;

const StyledLink = styled(Link)`
    display: block;
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.9em;
    font-weight: bold;
    width: 100%;
    text-align: center;

    &:hover {
        background-color: #0056b3;
    }
`;
