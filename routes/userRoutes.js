const express = require('express');
const { register, login, generateExcel, generatePdf } = require('../controllers/userController');
const multer = require('multer');
const userRouter = express.Router();

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

userRouter.post("/register", upload.single('image'), register);

userRouter.post("/login",login);

userRouter.get("/generateExcel",generateExcel);

userRouter.get("/generatepdf/:id",generatePdf);

module.exports = userRouter;