const multer = require('multer');
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const cloudinary = require("cloudinary").v2;
const streamifier = require('streamifier');
const User = require('../models/User');

router.get('/', customerController.homepage);
router.get('/dashboard',customerController.homepage);
router.get('/cred',customerController.credentialdata);
router.get('/add',customerController.addUser);
router.get('/addcred',customerController.addCredentials);
//router.post('/add',customerController.postUser);
router.post('/addcred',customerController.postCredentials);
router.get('/view/:id',customerController.view);
router.get('/viewcred/:id',customerController.viewcredential);
router.get('/edit/:id',customerController.edit);
router.put('/edit/:id',customerController.editemp);
router.delete('/edit/:id', customerController.deleteUser);
router.delete('/cred/:id', customerController.deleteCredentials);

// customercontroller.js

const fileUpload = multer();

router.post("/add", fileUpload.single("file"), async (req, res) => {
    const uploadImage = new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result.url);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });

  try {
    const imageUrl = await uploadImage;
    const devices = [];
    for (let i = 0; i < req.body.devices.length; i++) {
      const newDevice = {
        DeviceType: req.body.devices[i].DeviceType,
        DeviceID: req.body.devices[i].DeviceID,
      };
      devices.push(newDevice);
    }


    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      tel: req.body.tel,
      designation: req.body.designation,
      email: req.body.email,
      credentials: req.body.credentials,
      dept: req.body.dept,
      handover: imageUrl,
      devices: devices,
      antivirus: req.body.antivirus,
    });

    await User.create(newUser);

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.status(500).send("Image upload failed");
  }
});

module.exports = router;


