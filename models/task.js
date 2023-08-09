const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    
    title:{
        type: String,
    },
    dueDate:{
        type: Date,
    },
    attachment:{
        type: String
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    }
},{timestamps:true});

module.exports = mongoose.model("Task",TaskSchema);