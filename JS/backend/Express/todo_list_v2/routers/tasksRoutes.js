import express from 'express'
import {
    getAllTasks,
    renderTaskPage,
    createTask,
    changeStatus,
    deleteTask
} from '../controllers/tasksController.js'

const router = express.Router();


router.get('/api/tasks',getAllTasks);
router.get('/',renderTaskPage);
router.post('/delete/:id',deleteTask);
router.post('/done/:id',changeStatus);
router.post('/add',createTask);

export default router;