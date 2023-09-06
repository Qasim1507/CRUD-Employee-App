const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CredentialSchema = new Schema({
    userid:{
        type:String,
        required: true
    },
    pwd:{
        type:String,
        required: true
    },
    url:{
        type:String,
        required: true
    },
    remarks:{
        type:String,
        required: true
    }
});

module.exports = mongoose.model('Credential',CredentialSchema);