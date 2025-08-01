const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    
    const authHeader = req.headers['authorization'];

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message: 'Acceso denegado'})
    }

    const token = authHeader.split('')[1];
    
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    }catch (err){
        return res.status(401).json({message: 'Token inválido'})
    }
};

module.exports = authMiddleware;
