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
        const newTask = new task (req.body);
        const savedTask = await newTask.save();

        const userEmail = req.user?.email;
        sendEmail(
            userEmail,
            'Nueva tarea creada',
            `Has creado una nueva tarea: "${task.title}"`
        );

        res.status(201).json(savedTask);
    }catch (err){
        res.status(400).json({error: 'Error al crear la tarea '});
    }
};

//Actualizar una tarea
const updateTask = async (req, res) => {
    const {id} = req.params;
    const updatedData = req.body;

    try{
        const task = await task.findByIdAndUpdate(id, updatedData, {new: true})
        if(!task) {
            return res.status(404).json({error:'Tarea no encontrada'});
        }
        res.json(task)
    }catch(err){
        res.status(400).json({error: 'Error al actualizar la tarea'})
    }
};

//Eliminar una tarea 
const deleteTask = async (req, res) => {
    const {id} = req.params;

    try{
        const task = await task.findByIdAndDelete(id);
        if(!task){
            return res.status(404).json({error: 'Error al eliminar la tarea'});
        }
        res.status(204).send();
    }catch (err){
        res.status(400).json({error: 'Error al eliminar la tarea'});
    }
};

//Exportamos
module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};