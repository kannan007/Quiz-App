var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var scoresSchema=new Schema({
	category: {
		type: String,
		required: true
	},
	score: {
		type: Number,
		required: true
	}
}, {
    timestamps: true
});
var User = new Schema({
    username: String,
    password: String,
    admin:   {
        type: Boolean,
        default: false
    },
    scores:[scoresSchema]
},{
	timestamps: true
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);