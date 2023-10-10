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

// Handle 404
app.get("*", (req, res) => {
  res.status(404).render("404");
});

//Auht0
// app.get('/', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.oidc.isAuthenticated();
//   next();
// });

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
