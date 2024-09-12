import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

export function Inicio() {
    const [userInfo, setUserInfo] = useState({ name: '', role: '' });
    const [functions, setFunctions] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        if (token) {
            try {
                // Decodificar el token
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                console.log('Decoded Token:', decodedToken);

                // Asegúrate de que el nombre y el rol existan en el payload
                setUserInfo({ 
                    name: decodedToken.name || 'Desconocido', 
                    role: decodedToken.role || 'Sin rol' 
                });

                if (decodedToken.role === 'administrador') {
                    setFunctions(['Gestionar Inventario', 'Aprobar Solicitudes', 'Ver Informes', 'Gestionar Usuarios']);
                } else {
                    setFunctions(['Ver Inventario', 'Solicitar Aprobaciones', 'Ver Informes']);
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
            <h1>Bienvenido, {userInfo.name}!</h1>
            <h2>Tu rol: {userInfo.role}</h2>
            <h3>Funciones permitidas:</h3>
            <ul>
                {functions.map((func, index) => (
                    <li key={index}>{func}</li>
                ))}
            </ul>
        </Container>
    );
}

const Container = styled.div`
    height: 100%;
    width: 100%;
    background: ${({ theme }) => theme.bg3};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    h1 {
        margin: 0;
        padding: 20px;
        font-size: 2em;
    }

    h2 {
        margin: 0;
        padding: 10px;
        font-size: 1.5em;
    }

    h3 {
        margin: 20px 0 10px;
        font-size: 1.2em;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        padding: 5px;
        font-size: 1em;
    }
`;

