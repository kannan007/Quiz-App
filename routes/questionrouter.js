var express=require('express');
var bodyParser=require('body-parser');
var Verify = require('./verify');
var mongoose = require('mongoose');
var MCQ=require('../models/question');

var MCQrouter=express.Router();
MCQrouter.route('/')
.get(Verify.verifyOrdinaryUser,function(req,res,next) {
	//res.end("Hi Welcome");
	var category=req.headers['category-token'];
	if(category) {
		MCQ.find({"category":category},function(err,questions) {
			if (err) throw err;
			res.json(questions);
		});
	}
})
.post(function (req, res, next) {
    MCQ.create(req.body, function (err, question) {
        if (err) throw err;
        var id = question._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the Question with id: ' + id);
    });
});
MCQrouter.route('/:questionid')
.get(Verify.verifyOrdinaryUser,function(req,res,next) {
	MCQ.findById(req.params.questionid)
	.exec(function(err,question){
		if (err) throw err;
		res.json(question);
	})
});
module.exports=MCQrouter;