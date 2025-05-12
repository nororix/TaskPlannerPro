//Importar express
const express = require ('express');
const connectDB = require('./config/connectDB');
const tasksRoutes = require('./routes/tasks');
const authRoutes = require ('./routes/auth');
const path = require ('path');

const app = express();
connectDB();

//Middlewares
app.use(express.json());

//Rutas
app.use('/api/tasks', tasksRoutes);
app.use('/api/auth', authRoutes);

//Configuración del puerto
const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

//Configuración de Multer
const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,'uploads/');
    },
    filename: (req,file,cb) =>{
        cb(null,Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({storage});

//Ruta protegida para subir archivos
app.post('/upload', upload.single('file'), (req,res)=>{
    if(!req.file){
        return res.status(400).json({message: 'No se ha subido ningún archivo'});
    }
    res.status(200).json({message: 'Archivo subido con éxito', file: req.file});
});

