const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const PDFDocument = require('pdfkit');
const Excel = require('exceljs');
const SECRET_KEY = "TASKRESTAPI"

const register = async (req,res) => {

const { name, email, password } = req.body;
const image = req.file ? req.file.filename :null;

try {
    const existingUser = await userModel.findOne({ email: email });
    if(existingUser){
        return res.status(400).json({message:"User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const result = await userModel.create({
        name:name,
        email:email,
        password:hashedPassword,
        image:image
    });

    const token = jwt.sign({email:result.email, id:result._id }, SECRET_KEY);
    res.status(201).json({user:result, token:token });

} catch (error) {
    console.log(error);
    res.status(500).json("something went wrong");
}

}


const login = async (req,res) => {

    const { email, password } = req.body;

    try {
        
        const existingUser = await userModel.findOne({ email: email });
        if(!existingUser){
            return res.status(404).json({message:"User not found"});
        }

        const matchedPassword = await bcrypt.compare(password, existingUser.password);
        if(!matchedPassword){
            return res.status(400).json({message: "Invalid Credentials"});
        }

        const token = jwt.sign({email:existingUser.email, id:existingUser._id }, SECRET_KEY);
        res.status(201).json({user:existingUser, token:token });

    } catch (error) {
        console.log(error);
        res.status(500).json("something went wrong");
    }
}



const generateExcel = async (req,res) => {
    try {

        const users = await userModel.find();

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Users');

        worksheet.columns = [
            { header:'Name',key : 'name',width:15 },
            { header:'Email',key : 'email',width:30 },
            { header:'image',key : 'image',width:30 }
        ];

        users.forEach(user => {
            worksheet.addRow(user);
        });

        res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition','attachment',filename = users.xlsx);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.log(error);
        res.status(500).json('Something Went Wrong');
    }
}

const generatePdf = async (req,res) => {
    try {
        const userId = req.params.userId;

        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).send('User not found');
        }

        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream('user.pdf'));

        doc.fontSize(16).text('User Details:',{ underline: true }).moveDown();
        doc.text(`Name:${user.name}`).moveDown();
        doc.text(`Email:${user.email}`).moveDown();
        doc.text(`image:${user.image}`).moveDown();
        doc.end();

        res.setHeader('Content-Type','application/pdf');
        res.setHeader('Content-Disposition','attachment', `filename= ${user.name}.pdf`);

        const pdfStream = fs.createReadStream('user.pdf');
        pdfStream.pipe(res);

        pdfStream.on('end',()=> {
            fs.unlinkSync('user.pdf');
        });

    } catch (error) {
        console.log(error);
        res.status(500).json('Something Went Wrong')
    }
}
module.exports = { register,login, generateExcel, generatePdf };