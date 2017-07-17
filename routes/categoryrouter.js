var express=require('express');
var bodyParser=require('body-parser');
var Verify = require('./verify');
var mongoose = require('mongoose');
var Category=require('../models/question');

var Categoryrouter=express.Router();
Categoryrouter.route('/')
.get(Verify.verifyOrdinaryUser,function(req,res,next) {
	//res.end("hi");
	Category.find({}).distinct('category', function(err, category) {
		if (err) throw err;
		res.json(category);
	});
});
module.exports=Categoryrouter;