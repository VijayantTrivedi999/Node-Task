const taskModel = require("../models/task");


const createTask = async (req,res) => {
    const { title, dueDate, userId } = req.body;
    const attachment = req.file ? req.file.path : '';

    const newTask = new taskModel({
        title:title,
        dueDate:dueDate,
        attachment:attachment,
        userId:userId
    });

    try {
        await newTask.save();
        res.status(500).json(newTask);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong "});
    }
}

const getTasks = async (req,res) => {
    try {
        const tasks = await taskModel.find({userId: req.userId});
        res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong "});
    }
}

const updateTask = async (req,res) => {
    const id = req.params.id;
    const { title, dueDate, userId } = req.body;
    const attachment = req.file ? req.file.path : '';

    const newTask = {
        title:title,
        dueDate:dueDate,
        attachment:attachment,
        userId:userId
    }

    try {
        await taskModel.findByIdAndUpdate(id,newTask,{new: true});
        res.status(200).json(newTask);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong "});
    }
}

const deleteTask = async (req,res) => {
    
    const id = req.params.id;
    try {
        
        const task = await taskModel.findByIdAndRemove(id);
        res.status(202).json(task);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong "});
    }
}

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
}