const express = require("express");
const mongoose = require('mongoose');
const userRouter = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRoutes");
const app = express();

mongoose.connect("mongodb://localhost:27017/creativefueltask",
{
    useNewUrlParser:true,
    useUnifiedTopology:true
});


app.use("/users",userRouter);
app.use("/task",taskRouter);

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Hello Vijayant Trivedi");
})

app.listen(5000,()=>{
    console.log('Server started on port number 5000');
})