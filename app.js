require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const connectDB = require("./server/config/db");
const methodoverrride = require("method-override");
const fileRoute = require("./server/routes/customer");
const cloudinary = require("cloudinary").v2;
const { auth } = require("express-openid-connect");
const axios = require("axios").default;
const { requiresAuth } = require('express-openid-connect');
// const { sendEmailNotification } = require('./server/config/emailService');
// const Credential = require('./server/models/Credentialdata');
// const schedule = require('node-schedule');
// const moment = require('moment');

const app = express();
const port = 5100 || process.env.PORT;
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASEURL,
  clientID: process.env.AUTH0_CLIENTID,
  issuerBaseURL: process.env.AUTH0_ISSUEBASEURL,
};

connectDB();

app.use(auth(config));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodoverrride("_method"));

app.use(express.static("public"));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(
  flash({
    sessionKeyName: "express-flash-message",
  })
);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.oidc.isAuthenticated();
  next();
});

app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/customer"));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api/files", fileRoute);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  cloud_api: process.env.CLOUDINARY_API_KEY,
  cloud_secret: process.env.CLOUDINARY_SECRET,
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

app.get('/callback', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// Handle 404
app.get("*", (req, res) => {
  res.status(404).render("404");
});

async function getUserRolesFromAuth0(userId) {
  const options = {
    method: "GET",
    url: `https://samcomelectronics.us.auth0.com/api/v2/users/${userId}/roles`,
    headers: {
      Authorization: "Bearer " + process.env.AUTH0_TOKEN,
    },
  };

  try {
    const response = await axios.request(options);
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const roles = response.data.map((role) => role.name);
      console.log(roles);
      return roles;
    } else {
      console.log("User has no roles");
      return [];
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

getUserRolesFromAuth0('auth0|65094fd970d3cfe7ec80d964')

app.get("/", async (req, res) => {
 try {
    const userId = req.oidc.user.sub;
    const roles = await getUserRolesFromAuth0(userId);
    res.render("index", { roles });
 } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching user roles");
 }
});


// schedule.scheduleJob('58 11 * * *', async () => {
//   const data = await Credential.find();
//   const expiryThresholdInDays = 7;

//   const currentDate = moment().startOf('day');
//   const recordsToNotify = data.filter(record => {
//     const expiryDate = moment(record.expdate).startOf('day');
//     const daysUntilExpiry = expiryDate.diff(currentDate, 'days');

//     return daysUntilExpiry <= expiryThresholdInDays;
//   });

//   recordsToNotify.forEach(record => {
//     sendEmailNotification(record);
//   });
// });

