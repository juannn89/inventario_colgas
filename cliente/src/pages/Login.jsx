import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/login', { email, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
    
                // Decodifica el token para extraer el rol del usuario
                const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
                localStorage.setItem('userRole', decodedToken.role); // Almacena el rol en localStorage
    
                navigate('/inicio'); // Redirige al usuario a la página de inicio
            } else {
                throw new Error('Token no recibido');
            }
        } catch (error) {
            setError('Error al iniciar sesión. Verifica tus credenciales.');
        }
    };    

    return (
        <LoginContainer>
            <LoginBox>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    {error && <Error>{error}</Error>}
                    <button type="submit">Login</button>
                </form>
                <p>
                    ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
                </p>
            </LoginBox>
        </LoginContainer>
    );
}

const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
`;

const LoginBox = styled.div`
    background: rgba(255, 255, 255, 0.9);
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 100%;
    max-width: 400px;

    h1 {
        margin-bottom: 20px;
        font-size: 24px;
        color: #333;
    }

    form {
        display: flex;
        flex-direction: column;
    }

    label {
        margin-bottom: 10px;
        font-size: 14px;
        color: #333;
    }

    input {
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: 100%;
    }

    button {
        padding: 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        width: 100%;
    }

    button:hover {
        background-color: #0056b3;
    }

    p {
        margin-top: 20px;
        font-size: 14px;
        color: #333;
    }

    a {
        color: #007bff;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }
`;

const Error = styled.p`
    color: red;
    margin-bottom: 20px;
`;
