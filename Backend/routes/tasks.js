const express = require ('express');
const router = express.Router();
const { getTasks, createTask } = require('../controllers/taskController');

//GET para obtener las tareas
router.get('/', (req, res) => {
    res.send('Listado de tareas');
});

router.get('/',getTasks);
router.post('/', createTask);


module.exports = router; 