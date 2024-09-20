import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/col.png'; // Asegúrate de que la ruta sea correcta

export function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/register', {
                username,
                password,
                email,
                role: 'usuario'
            });
            alert('Registro exitoso');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Error en el registro');
        }
    };

    return (
        <Container>
            <Header>
                <img src={logo} alt="Logo COLGAS" />
                <h1>Bienvenido al sistema de inventario COLGAS</h1>
            </Header>
            <FormWrapper>
                <h2>Registro</h2>
                <form onSubmit={handleRegister}>
                    <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit">Registrar</Button>
                </form>
                {error && <ErrorText>{error}</ErrorText>}
                <LinkWrapper>
                    <StyledLink to="/login">¿Ya tienes una cuenta? Inicia sesión</StyledLink>
                </LinkWrapper>
            </FormWrapper>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f9; /* Fondo gris claro para un estilo formal */
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 40px; /* Espacio entre el encabezado y el formulario */

    img {
        width: 100px;
        margin-bottom: 10px;
    }

    h1 {
        font-size: 18px;
        color: #333;
        margin: 0;
    }
`;

const FormWrapper = styled.div`
    background: #fff;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Sombra suave */
    max-width: 400px;
    width: 100%;
    text-align: center;
    border: 1px solid #e0e0e0; /* Borde gris claro */

    h2 {
        margin-bottom: 20px;
        font-size: 18px; /* Tamaño de fuente del encabezado */
        color: #333;
        font-weight: bold; /* Negrilla */
        font-family: 'Arial', sans-serif; /* Mismo tipo de fuente que el h1 en el Header */
    }
`;

const Input = styled.input`
    display: block;
    width: 100%;
    margin-bottom: 15px;
    padding: 12px; /* Espaciado más grande */
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px; /* Fuente más grande */
    box-sizing: border-box;
`;

const Button = styled.button`
    width: 100%;
    padding: 12px;
    background-color: #007BFF; /* Azul */
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px; /* Fuente más grande */
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
`;

const ErrorText = styled.p`
    color: red;
    margin-top: 10px;
`;

const LinkWrapper = styled.div`
    margin-top: 15px;
`;

const StyledLink = styled(Link)`
    color: #007BFF;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;
