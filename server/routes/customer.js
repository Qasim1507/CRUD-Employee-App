const multer = require("multer");
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const User = require("../models/User");
const Credential = require("../models/Credentialdata");

router.get("/", customerController.homepage);
router.get("/dashboard", customerController.homepage);
router.get("/cred", customerController.credentialdata);
router.get("/add", customerController.addUser);
router.get("/addcred", customerController.addCredentials);
//router.post('/add',customerController.postUser);
router.post("/addcred", customerController.postCredentials);
router.get("/view/:id", customerController.view);
router.get("/viewcred/:id", customerController.viewcredential);
router.get("/edit/:id", customerController.edit);
router.get("/editcred/:id", customerController.editcredentials);
//router.put("/edit/:id", customerController.editemp);
router.delete("/edit/:id", customerController.deleteUser);
router.delete("/cred/:id", customerController.deleteCredentials);
router.post('/search', customerController.searchUsers);

// customercontroller.js

const fileUpload = multer();

router.post("/add", fileUpload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      let devices = [];
      if (req.body.devices && Array.isArray(req.body.devices)) {
        devices = req.body.devices;
      }

      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        tel: req.body.tel,
        designation: req.body.designation,
        email: req.body.email,
        credentials: req.body.credentials,
        dept: req.body.dept,
        devices: devices,
        antivirus: req.body.antivirus,
      });

      await User.create(newUser);

      res.redirect("/dashboard");
    }

    if (req.file) {
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

      const imageUrl = await uploadImage;
      let devices = [];
      if (req.body.devices && Array.isArray(req.body.devices)) {
        devices = req.body.devices;
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
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Image upload failed");
  }
});

router.put("/edit/:id", fileUpload.single("file"), async (req, res) => {
  try {
    let devices = [];
    if (req.body.devices && Array.isArray(req.body.devices)) {
      devices = req.body.devices;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      // Handle case where user with the specified ID is not found
      return res.status(404).json({ error: "User not found" });
    }

    let imageUrl = user.handover; // Get the current handover image from the user document

    // Check if a new file is uploaded, if yes, upload it to Cloudinary and get the new image URL
    if (req.file) {
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

      imageUrl = await uploadImage; // Update the imageUrl with the new uploaded image URL
    }

    const updatedFields = {
      firstName: req.body.firstName || user.firstName,
      lastName: req.body.lastName || user.lastName,
      tel: req.body.tel || user.tel,
      designation: req.body.designation || user.designation,
      email: req.body.email || user.email,
      credentials: req.body.credentials || user.credentials,
      dept: req.body.dept || user.dept,
      devices: devices.length > 0 ? devices : user.devices,
      antivirus: req.body.antivirus || user.antivirus,
      handover: imageUrl, // Update the handover field with the new imageUrl
    };

    await User.findByIdAndUpdate(req.params.id, updatedFields);

    res.redirect(`/edit/${req.params.id}`);
  } catch (error) {
    console.error(error);
    // Handle error appropriately
  }
});

router.put("/editcred/:id", async (req, res) => {
  try {
    const credential = await Credential.findById(req.params.id);

    // Update the fields if new values are provided, otherwise keep the existing values
    credential.userid = req.body.userid || credential.userid;
    credential.pwd = req.body.pwd || credential.pwd;
    credential.url = req.body.url || credential.url;
    credential.name = req.body.name || credential.name;
    credential.expdate = req.body.expdate || credential.expdate;
    credential.remarks = req.body.remarks || credential.remarks;

    await credential.save();

    // Redirect to the updated credential detail page
    res.redirect("/cred");
  } catch (error) {
    console.log(error);
    res.redirect("/cred");
  }
});



module.exports = router;
