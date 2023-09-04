const User = require('../models/User');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dnciu5igz',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure:true
});

console.log(cloudinary.config());

/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) => {

    //const messages = await req.consumeFlash('info');

    const locals={
        title: 'NODE JS',
        description: 'NODEJS TRIAL'
    }

    let perPage = 10;
    let page = req.query.page || 1; 

    try {
        const users = await User.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
      const count = await User.count();

      res.render('index', {
        locals,
        users,
        current: page,
        pages: Math.ceil(count / perPage)
      });

    } catch (error) {
        console.log(error)
    }

    //res.render('index',locals);
}

/**
 * GET /
 * New User Form
 */
exports.addUser = async (req, res) => {
    const locals = {
      title: "Add New User - NodeJs",
      description: "Free NodeJs User Management System",
    };
  
    res.render("user/add", locals);
};

/**
 * POST /
 * Create New User Form
 */
exports.postUser = async (req, res) => {

    console.log(req.body);
    cloudinary.uploader
    .upload('../text.txt')
    .then(result=>console.log(result));

    // const newUser = new User({
    //     firstName:req.body.firstName,
    //     lastName:req.body.lastName,
    //     tel:req.body.tel,
    //     designation:req.body.designation,
    //     email:req.body.email,
    //     credentials:req.body.credentials,
    //     dept:req.body.dept,
    //     handover:req.body.handover,
    // });

    // try {
    //     await User.create(newUser);
    //     //await req.flash('info','New Employee has been added');
    //     res.redirect('/');
    // } catch (error) {
    //     console.log(error);
    // }  
};

/**
 * View User Data
 */
exports.view = async (req, res) => {

    try {
      const users = await User.findOne({ _id: req.params.id })
  
      const locals = {
        title: "View Employee Data",
        description: "Free NodeJs User Management System",
      };
  
      res.render('user/view', {
        locals,
        users
      })
  
    } catch (error) {
      console.log(error);
    }
}

/**
 * GET /
 * Edit User Data 
*/
exports.edit = async (req, res) => {

    try {
      const users = await User.findOne({ _id: req.params.id })
  
      const locals = {
        title: "Edit Employee Data",
        description: "Free NodeJs User Management System",
      };
  
      res.render('user/edit', {
        locals,
        users
      })
  
    } catch (error) {
      console.log(error);
    }
  
}

/**
 * GET /
 * Update User Data 
*/
exports.editemp = async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id,{
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        tel:req.body.tel,
        designation:req.body.designation,
        email:req.body.email,
        credentials:req.body.credentials,
        dept:req.body.dept,
        handover:req.body.handover,
      });
      await res.redirect(`/edit/${req.params.id}`);
      
      //console.log('redirected');
    } catch (error) {
      console.log(error);
    }
}

/**
 * Delete /
 * Delete Customer Data 
*/
exports.deleteUser = async (req, res) => {
    try {
      await User.deleteOne({ _id: req.params.id });
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  }
  