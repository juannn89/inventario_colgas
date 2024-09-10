const jwt = require('jsonwebtoken');

const checkRole = (roles) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No se proporcionó un token' });
        }

        try {
            const decoded = jwt.verify(token, 'your_jwt_secret');
            const userRole = decoded.role;

            if (roles.includes(userRole)) {
                req.user = decoded; // Añade el usuario decodificado a la solicitud
                next();
            } else {
                res.status(403).json({ error: 'Acceso denegado' });
            }
        } catch (error) {
            console.error('Error al verificar el token:', error);
            res.status(401).json({ error: 'Token inválido' });
        }
    };
};

module.exports = checkRole;
