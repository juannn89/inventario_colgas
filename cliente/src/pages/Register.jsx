import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Asegúrate de importar useNavigate
import styled from 'styled-components';

export function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook para redirigir

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/register', { 
                username, 
                password, 
                email, 
                role: 'usuario' // Asegurarse de que se registre como "usuario"
            });
            alert('Registro exitoso');
            navigate('/login'); // Redirigir al login después de un registro exitoso
        } catch (err) {
            setError(err.response?.data?.error || 'Error en el registro');
        }
    };

    return (
        <Container>
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
                    <Button type="submit">Register</Button>
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
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
`;

const FormWrapper = styled.div`
    background: rgba(255, 255, 255, 0.8);
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    width: 100%;
    text-align: center;
`;

const Input = styled.input`
    display: block;
    width: 100%;
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Button = styled.button`
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #45a049;
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

