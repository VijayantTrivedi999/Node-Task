const express = require('express');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');
const multer = require('multer');
const taskRouter = express.Router();

// Multer for image upload 
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'uploads/');
    },
    filename : (req,file,cb) => {
        cb(null,new Date().toISOString() + '-' + file.originalname);
    },
});

const upload = multer({ storage : storage });

taskRouter.get("/",auth,getTasks);

taskRouter.post("/",auth,upload.single('attachment'),createTask);

taskRouter.put("/:id",auth,upload.single('attachment'),updateTask);

taskRouter.delete("/:id",auth,deleteTask);

module.exports = taskRouter;
