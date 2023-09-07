const multer = require('multer');
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const cloudinary = require("cloudinary").v2;
const streamifier = require('streamifier');

router.get('/', customerController.homepage);
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
router.post("/add",fileUpload.single("My file"), async (req,res)=>{
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result.url;
    }
    upload(req);
})

module.exports = router;
