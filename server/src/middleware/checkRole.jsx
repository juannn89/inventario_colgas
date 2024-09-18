const jwt = require('jsonwebtoken');

const checkRole = (roles) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            console.log('No se proporcionó un token');
            return res.status(401).json({ error: 'No se proporcionó un token' });
        }

        try {
            const decoded = jwt.verify(token, 'your_jwt_secret');
            const userRole = decoded.role;
            
            console.log('Token decodificado:', decoded);
            console.log('Rol del usuario:', userRole);

            if (roles.includes(userRole)) {
                req.user = decoded; // Añade el usuario decodificado a la solicitud
                next();
            } else {
                console.log('Acceso denegado. Rol del usuario no autorizado.');
                res.status(403).json({ error: 'Acceso denegado' });
            }
        } catch (error) {
            console.error('Error al verificar el token:', error);
            res.status(401).json({ error: 'Token inválido' });
        }
    };
};

module.exports = checkRole;

