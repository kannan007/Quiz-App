var express = require('express');
var userrouter = express.Router();
var User = require('../models/user');
var passport = require('passport');
var Verify    = require('./verify');
const mongoose = require('mongoose');
/* GET users listing. */
userrouter.route('/')
.get(Verify.verifyAdmin,Verify.verifyOrdinaryUser, function(req, res, next) {
  User.find({"admin":false}, function (err, users) {
      if (err) throw err;
      res.json(users);
    });
});
userrouter.post('/register', function(req, res, next) {
  User.register(new User({ username : req.body.username }),req.body.password, function(err, user) {
    if (err) {
      return res.status(500).json({err: err});
    }
    user.save(function(err,user) {
      passport.authenticate('local')(req, res, function () {
        return res.status(200).json({status: 'Registration Successful!'});
      });
    });
  });
});
userrouter.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      var token = Verify.getToken(user);
      //res.redirect('index.js');
      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token,
        id: user._id
      });
    });
  })(req,res,next);
});
userrouter.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});
userrouter.route('/:userId')
  .get(function(req,res,next) {
    res.end(req.params.userId);
})
.delete(Verify.verifyAdmin,Verify.verifyOrdinaryUser,function (req, res, next) {
  //res.json(req.params.userId);
  //var _id=  mongoose.Types.ObjectId(req.params.userId);
  //console.log(_id);
  User.findByIdAndRemove(req.params.userId, function (err, resp) {
    if(err) {
      return res.status(500).json({err: err});
    }
    res.json(resp);
  });
});
userrouter.route('/:userId/scores')
.get(function(req,res,next) {
  res.end("Podang ");
})
.post(function(req,res,next) {
  User.findById(req.params.userId, function (err, user) {
    if (err) throw err;
    //req.body.postedBy = req.decoded._doc._id;
    //console.log(req.body);s
    user.scores.push(req.body);
    user.save(function (err, score) {
      if (err) throw err;
      res.json(score);
    });
  });
});
module.exports = userrouter;
