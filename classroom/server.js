const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: false,
};

app.use(session(sessionOptions));
app.use(flash());

app.get("/reg", (req, res) => {
  let { name } = req.query;
  req.session.name = name;
  req.flash("success", "user registered successfully");
  res.redirect("/hello");
});
app.get("/hello", (req, res) => {
  res.locals.msgs = req.flash("success");
  res.render("page", { name: req.session.name });
});

app.listen(8080, () => {
  console.log("Server is listenngg at port 8080...");
});
