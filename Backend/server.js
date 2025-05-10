//Importar express
const express = require ('express');
const app = express();

app.use(express.json());

//Ruta de prueba
app.get('/',(req,res) =>{
    res.send('Servidor funcionando')
});

//Rutas específicas 
const tasksRoutes = require('./routes/tasks');
app.use('/api/tasks', tasksRoutes);

const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});