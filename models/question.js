var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var questionsSchema=new Schema({
	category:{
		type:String,
		required: true,
	},
	question: {
		type:String,
		required: true,
	},
	correctanswer: {
		type: String,
		required: true
	},
	options: [{
		type: String,
		required: true
	}]
});
var Questions= mongoose.model('MCQ',questionsSchema);
module.exports=Questions;