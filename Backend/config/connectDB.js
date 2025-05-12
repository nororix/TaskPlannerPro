const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect('mongodb+srv://nororoxadm:w7EMctP2DarsbKTO@cluster0.3bjszwd.mongodb.net/ n')
        console.log('Base de datos conectada correctamente');
    }catch (error){
        console.error('Error en la conexión de Base de datos: ', error);
        process.exit(1)
    }
};

module.exports = connectDB;