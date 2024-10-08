import { Routes, Route, Navigate } from 'react-router-dom';
import { Inicio } from '../pages/Inicio';
import { Inventario } from '../pages/Inventario';
import { Aprobaciones } from '../pages/Aprobaciones';
import { Usuarios } from '../pages/Usuarios';
import { Informes } from '../pages/Informes';
import { Register } from '../pages/Register';
import { Login } from '../pages/Login';
import { Ingresos } from '../pages/Ingresos'
import PrivateRoute from './Privateroute'; // Importa el componente PrivateRoute

export function MyRoutes() {
    return (
        <Routes>
            {/* Rutas públicas: Login y Registro */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas privadas para el rol de administrador y usuario */}
            <Route path="/inicio" element={<PrivateRoute element={Inicio} requiredRoles={['administrador', 'usuario']} />} />
            <Route path="/inventario" element={<PrivateRoute element={Inventario} requiredRoles={['administrador', 'usuario']} />} />
            <Route path="/aprobaciones" element={<PrivateRoute element={Aprobaciones} requiredRoles={['administrador']} />} />
            <Route path="/usuarios" element={<PrivateRoute element={Usuarios} requiredRoles={['administrador']} />} />
            <Route path="/informes" element={<PrivateRoute element={Informes} requiredRoles={['administrador']} />} />
            <Route path="/Ingresos" element={<PrivateRoute element={Ingresos} requiredRoles={['administrador']} />} />
            
            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}

