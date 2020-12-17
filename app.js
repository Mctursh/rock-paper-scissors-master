require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-find-or-create')

//Congigures our app to use express
const app = express();

//setting directory's for our view engine and static files
app.set("views", __dirname + "/views/")
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"))

//configuring our app to use session module
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

//configuring our app to use passport to inialize and set up a session for users
app.use(passport.initialize());
app.use(passport.session());

//Connecting to our Database
mongoose.connect("mongodb://localhost:27017/rpsDB", {useNewUrlParser: true, useUnifiedTopology: true});

//Schema creation
const userSchema =new mongoose.Schema({
  name: String,
  googleId: String,
  imageURL: String,
  score: Number
});

//setting our userSchema to use an exxternal plugin(findOrCreate)
userSchema.plugin(findOrCreate);

//Creating our model
const User = mongoose.model("User", userSchema);

//this creates a cookie once a session is started and stores user data in the client side
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//this destroys the cookie along with the data when ever a session is ended
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//configures the google strategy being used for authentication
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/rock-paper-scissors",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  },
  function(accessToken, refreshToken, profile, cb) {
    //check to create a user(if none) or find an existing user
    User.findOrCreate({ googleId: profile.id}, function (err, user) {

      //finds the newly found/created user and updates its profile
      User.findOneAndUpdate({ googleId: profile.id},{$set: {name: profile.name.familyName, imageURL: profile._json.picture}}, {useFindAndModify: false}, function(err, user) {
        if (!err) {
        } else {
          console.log(err);
        }
      });
      return cb(err, user);
    });
  }
));

// to filter the current user visiting the page
// founduser.filter(u => {
//   if (u.googleId == req.user.googleId) {
//     var currentUser = u
//   }
// })


app.get("/", function(req, res) {
  console.log(req);
  res.sendFile(__dirname + "/public/index.html")
});

app.get("/home", function(req, res){
  //check if a user is authenticated
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

//Authenticates a user using the google strategy
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/rock-paper-scissors',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/home")
});

//listen for port 3000
app.listen(3000, function(req, res) {
  console.log("Succefully running on port 3000");
})


//Function for finding arranging in descending order
// let list = [10, 5, 3, 15, 12, 7, 11, 20]
//
// let biggest = (scores) => {
//     let arrList = []
//     let i = scores.length
//     while (scores.length < (i + 1)) {
//         let max = (Math.max(...scores))
//         arrList.push(max)
//         let index = scores.indexOf(max)
//         scores.splice(index, 1)
//         if (scores.length === 0) {
//             break
//         } else {
//             i--
//         }
//
//     }
//     return arrList
// }
//
// biggest(list);
