const express = require('express');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');
const taskRouter = express.Router();

taskRouter.get("/",auth,getTasks);

taskRouter.post("/",auth,createTask);

taskRouter.put("/:id",auth,updateTask);

taskRouter.delete("/:id",auth,deleteTask);

module.exports = taskRouter;