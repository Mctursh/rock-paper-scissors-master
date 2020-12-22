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
  score: Number,
  currentRank: Number,
  previousRank: Number
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
    let googleID = profile.id
    let name = profile.name.familyName
    let imageURL = profile._json.picture
    let currentRank = 0;

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


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html")
});

app.get("/home", function(req, res){
  //check if a user is authenticated
  if (req.isAuthenticated()) {
    User.find({}, (err, docs) => {
      if (!err) {
        let rankNumber = 1
        docs.forEach( p => {
        if (p.score == null || undefined) {
          p.score = 0
        }
          p.previousRank = p.currentRank
        })

        let scores = []
        docs.forEach( u => {
          scores.push(u.score)
        })

        let rankingScores = [...scores]

        let refreshedRearrangedScores = biggest(scores)

        let arrangedScores = biggest(rankingScores)
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

app.get("/restart/win", (req, res) => {
  if (req.isAuthenticated()) {
    let googleID = req.user.googleId
    User.findOne({googleId: googleID}, function(err, user) {
      user.score += 5;
      user.save()
      res.redirect("/home");
    })
  } else {
    res.redirect("/")
  }
})

app.get("/restart/lose", (req, res) => {
  if (req.isAuthenticated()) {
    let googleID = req.user.googleId
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

//listen for port 3000
app.listen(3000, function(req, res) {
  console.log("Succefully running on port 3000");
})




let biggest = (scores) => {
    let arrList = []
    let i = scores.length
    while (scores.length < (i + 1)) {
        let max = (Math.max(...scores))
        arrList.push(max)
        let index = scores.indexOf(max)
        scores.splice(index, 1)
        if (scores.length === 0) {
            break
        } else {
            i--
        }

    }
    return arrList
}
