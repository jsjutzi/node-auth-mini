const express = require("express");
const session = require("express-session");
const passport = require("passport");
const strategy = require("./strategy");
const { secret } = require("./config.js");

const app = express();

app.use(
  session({
    secret: "sup dude",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(strategy);

//fired every time a request is made

passport.serializeUser(function(user, done) {
  done(null, { user });
});

//pulls user obj stored on sessions
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get(
  "/login",
  passport.authenticate("auth0", {
    successRedirect: "/me",
    falureRedirect: "/login",
    failureFlash: true
  })
);

app.get("/me", (req, res, next) => {
  if (req.user) {
    res.json(req.user);
  } else {
    // req.user === req.session.passport.user
    // console.log( req.user )
    // console.log( req.session.passport.user );
    res.status(200).send(JSON.stringify(req.user, null, 10));
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
