const multer = require('multer');
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const cloudinary = require("cloudinary").v2;
const streamifier = require('streamifier');

router.get('/', customerController.login);
router.get('/dashboard',customerController.homepage);
router.get('/cred',customerController.credentialdata);
router.get('/add',customerController.addUser);
router.get('/addcred',customerController.addCredentials);
router.post('/add',customerController.postUser);
router.post('/addcred',customerController.postCredentials);
router.get('/view/:id',customerController.view);
router.get('/viewcred/:id',customerController.viewcredential);
router.get('/edit/:id',customerController.edit);
router.put('/edit/:id',customerController.editemp);
router.delete('/edit/:id', customerController.deleteUser);
router.delete('/cred/:id', customerController.deleteCredentials);

let fileUpload = multer()
router.post("/upload",fileUpload.single("My file"), async (req,res)=>{
  try {
      if(!req.file)
          return res.status(400).json({message:"Insert file"});

      console.log(req.file);
      let uploadedFile = UploadApiResponse;
      uploadedFile = await cloudinary.uploader.upload('./'+req.filename,function(res,err){
          console.log(res,err)
      })
      const {originalname} = req.file
      const {secure_url,bytes,format} = uploadedFile
      
      const file = await File.create({
          filename:originalname,
          sizeInBytes:bytes,
          secure_url,
          format
      });
      res.status(200).json(file);
  } catch (error) {
      console.log(error.message);
      res.status(500).json({message:"Server error"})
  }
})

module.exports = router;