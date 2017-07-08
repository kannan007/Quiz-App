var express = require('express');
var router = express.Router();
var User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, function (err, users) {
      if (err) throw err;
      res.json(users);
    });
});
router.post('/register', function(req, res, next) {
  User.create(req.body, function (err, promotions) {
      if (err) throw err;
      console.log("Registed user");
      res.writeHead(200, {
          'Content-Type': 'text/plain'
      });
      res.end("Registed Successfully");
  });
});
module.exports = router;
