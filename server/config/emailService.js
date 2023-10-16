const nodemailer = require("nodemailer");
const moment = require("moment");
const Credential = require('../models/Credentialdata');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'qasim.fakharuddin2021@vitstudent.ac.in',
    pass: 'Qasim102938/',
  }
});

async function sendEmailNotification(record) {
  const mailOptions = {
    from: 'YOUR_EMAIL_ADDRESS',
    to: 'nalawalaq@gmail.com',
    subject: 'Expiry Date Reminder',
    text: `The expiry date of ${record.name} is approaching. Please take necessary action.`,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.response);
  } catch (error) {
    console.log('Error sending email:', error);
  }
}

module.exports = {
  sendEmailNotification,
};