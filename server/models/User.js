const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  tel: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  designation: {
    type: String,
    required: false,
  },
  credentials: {
    type: String,
    required: false,
  },
  dept: {
    type: String,
    required: false,
  },
  handover: {
    type: String,
    required: false,
  },
  antivirus: {
    type: String,
    required: false,
  },
  devices: [
    {
      DeviceType: {
        type: String,
      },
      DeviceID: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
