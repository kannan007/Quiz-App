var express=require('express');
var bodyParser=require('body-parser');
var Verify = require('./verify');
var mongoose = require('mongoose');
var Category=require('../models/question');

var Categoryrouter=express.Router();
Categoryrouter.route('/')
.get(function(req,res,next) {
	Category.find({}).distinct('category', function(err, category) {
		if (err) throw err;
		res.json(category);
	});
});
module.exports=Categoryrouter;