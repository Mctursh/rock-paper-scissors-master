require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-find-or-create')

const app = express();

app.set("views", __dirname + "/views/")
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb://localhost:27017/rpsDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema =new mongoose.Schema({
  name: String,
  googleId: String,
  imageURL: String,
  score: Number
});

userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//this destroys the cookie along with the data when ever a session is ended
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/rock-paper-scissors",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id}, function (err, user) {

      User.findOneAndUpdate({ googleId: profile.id},{$set: {name: profile.name.familyName, imageURL: profile._json.picture}}, {useFindAndModify: false}, function(err, user) {
        if (!err) {
          // console.log(userProfile);
        } else {
          console.log(err);
        }
      });
      return cb(err, user);
    });
  }
));



app.get("/", function(req, res) {
  console.log(req);
  res.sendFile(__dirname + "/public/index.html")
});

app.get("/home", function(req, res){
  if (req.isAuthenticated()) {
    User.findOne({googleId: req.user.googleId}, function(err, foundUser) {
      if (err){
        console.log(err);
      } else {
        console.log(req);
        res.render('home', {imageURL: foundUser.imageURL, familyName: foundUser.name});
      }
    })
  } else {
    res.sendFile(__dirname + "/public/index.html")
  }
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/rock-paper-scissors',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/home")
});






app.listen(3000, function(req, res) {
  console.log("Succefully running on port 3000");
})
