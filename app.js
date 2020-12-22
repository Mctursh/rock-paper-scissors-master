require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const biggest = require('./biggest')

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
mongoose.connect("mongodb+srv://admin-ayoade:" + process.env.MONGO_CLUSTER_ACCESS +"@cluster0.4d1r2.mongodb.net/rpsDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

//Schema creation
const userSchema = new mongoose.Schema({
  name: String,
  googleId: String,
  imageURL: String,
  score: Number,
  currentRank: Number,
  previousRank: Number
});

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
    callbackURL: "https://pacific-springs-53090.herokuapp.com/auth/google/rock-paper-scissors",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  },
  function(accessToken, refreshToken, profile, cb) {

    let googleID = profile.id
    let name = profile.name.familyName
    let imageURL = profile._json.picture

    //check to create a user(if none) or find an existing user
    User.findOne({googleId: googleID}, (err, user) => {
      if (user == null || undefined) {
        User.create({name: name, googleId: googleID, imageURL: imageURL, currentRank: 0}, (err, user) => {
          if (err) {
            console.log(err);
          }
          return cb(err, user);
        })
      } else {
        return cb(err, user);
      }
    });
  }))

//route for unregistered users
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html")
});

//route for registered users
app.get("/home", function(req, res){
  //check if a user is authenticated
  if (req.isAuthenticated()) {
    User.find({}, (err, docs) => {    //finds all documents
      if (!err) {
        let rankNumber = 1
        docs.forEach( p => {         //check for newly signed up user to fill the score value
        if (p.score == null || undefined) {
          p.score = 0
        }
          p.previousRank = p.currentRank    //this updates the previous rank
        })

         //this gets and pushes all the user scores into an array
        let scores = []
        docs.forEach( u => {
          scores.push(u.score)
        })

        let rankingScores = [...scores]

        //biggest function arranges the scores in descending order
        let refreshedRearrangedScores = biggest(scores)
        let arrangedScores = biggest(rankingScores)

        //this updates the value of the new rank of the users
        docs.forEach( d => {
          let currentRank = arrangedScores.indexOf(d.score) + 1
          d.currentRank = currentRank
          d.save()
          arrangedScores[arrangedScores.indexOf(d.score)] = null
        })
        res.render('home', {imageURL: req.user.imageURL, familyName: req.user.name, users: docs, refreshedRearrangedScores: refreshedRearrangedScores});
      } else {
        console.log(err);
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

//route triggered for win
app.get("/restart/win", (req, res) => {
  //check if user is authenticated
  if (req.isAuthenticated()) {
    let googleID = req.user.googleId

    //finds the user and update the score
    User.findOne({googleId: googleID}, function(err, user) {
      user.score += 5;
      user.save()
      res.redirect("/home");
    })
  } else {
    res.redirect("/")
  }
})

//route triggered for loss
app.get("/restart/lose", (req, res) => {
  //check if user is authenticated
  if (req.isAuthenticated()) {
    let googleID = req.user.googleId

    //finds user and update the score
    User.findOne({googleId: googleID}, function(err, user) {
      user.score -= 3;
      User.find({}, (err, docs) => {})
      user.save()
      res.redirect("/home");
    })
  } else {
    res.redirect("/")
  }
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

//listen for port
app.listen(port, function(req, res) {
  console.log("Succefully running on port 3000");
})
