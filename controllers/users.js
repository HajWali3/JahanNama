const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const regUser = await User.register(newUser, password);

    req.login(regUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to Wonderlust");
      return res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to wonderlast! You are logged in");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};
module.exports.logout = (req, res) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You are logged out now!");
    res.redirect("/listings");
  });
};
