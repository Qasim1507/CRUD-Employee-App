const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const CredentialSchema = new Schema({
  userid: {
    type: String,
    required: false,
  },
  pwd: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  expdate: {
    type: Date,
    required: false,
  },
  remarks: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Credential", CredentialSchema);
