import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, requiredRoles }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole'); // Obtén el rol directamente del localStorage
    
    if (!token || !userRole) {
        return <Navigate to="/login" />; // Redirige si no hay token o rol
    }

    // Verificar si el rol del usuario es uno de los roles requeridos
    if (!requiredRoles.includes(userRole)) {
        return <Navigate to="/inicio" />; // Redirigir a una página predeterminada si el rol no coincide
    }

    return <Element />;
};

export default PrivateRoute;

