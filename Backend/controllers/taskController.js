const task = require ('../models/task');

//Obtener las tareas
const getTasks = async(req,res)=>{
    try{
        const tasks = await task.find();
        res.json(tasks);
    } catch (err){
        res.status(500).json({error: 'Error al obtener las tareas'});
    }
};

//Crear una nueva tarea
const createTask = async (req, res) => {
    try{
        const newTask = new Task (req.body);
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    }catch (err){
        res.status(400).json({error: 'Error al crear la tarea '});
    }
};

//Exportamos
module.exports = {
    getTasks,
    createTask
};