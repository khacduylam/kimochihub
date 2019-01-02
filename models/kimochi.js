var mongoose 	= require("mongoose");
var moment  	= require("moment");

var kimochiSchema = new mongoose.Schema({
	name: String,
	imageUrl: String,
	location: String,
	description: String,
	raters: [
		{
			_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
			stars: {type: Number, max: 5, min: 0}
		}
	],
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	kimochi_author: {
		_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
		username: String
	},
	kimochi_time: {type: Date, default: Date.now}
});

kimochiSchema
.virtual("createdAt")
.get(function(){
	return moment(this.kimochi_time).format("LLLL");
});

kimochiSchema
.virtual("stars")
.get(function(){
	let total = 0;
	this.raters.forEach(function(rater){
		total += rater.stars;
	});
	return total / this.raters.length;
});

module.exports = mongoose.model('Kimochi', kimochiSchema);