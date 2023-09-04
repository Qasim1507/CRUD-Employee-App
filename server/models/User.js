const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    firstName:{
        type:String,
        required: true
    },
    lastName:{
        type:String,
        required: true
    },
    tel:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    designation:{
        type:String,
        required: true
    },
    credentials:{
        type:String,
        required: true
    },
    dept:{
        type:String,
        required: true
    },
    handover:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('User',UserSchema);