const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const register =async (req, res) =>{
    try{
        const{username, email, password } =req.body;
        const existingUser = await User.findOne ({email});
        if (existingUser) return res.status(400).json({msg: 'El usuario ya existe'});
        
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({username, email, password: hashedPassword});
        await newUser.save();

        res.status(201).json({msg:'Usuario registrado con éxito'})
    }catch (err){
        console.error(err);
        res.status(500).json({msg: 'Error al registrar el usuario'});
    }
};

const login = async (req, res) =>{
    const {username, password} = req.body;

    try{
        const user = await User.findOne({username});
        if(!user) return res.status(401).json({message: 'Usuario no encontrado'});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({message: 'Contraseña incorrecta'});

        const token = jwt.sign(
            {id: user._id, email:user.email},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.json({token});
    }catch (err){
        console.error('Error en login:', err);
        res.status(500).json({message: 'Error del servidor'});
    }
}
    

module.exports = {register, login};