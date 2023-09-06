const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const LoginSchema = new Schema({
    username:{
        type:String,
        required: true
    },
    loginpwd:{
        type:String,
        required: true
    }
});

module.exports = mongoose.model('LoginData',LoginSchema);