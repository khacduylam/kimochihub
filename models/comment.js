var mongoose 	= require("mongoose");
var moment 		= require("moment");

var commentSchema = new mongoose.Schema({
	comment_text: String,
	comment_author: {
		_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
		username: String,
		stars: {type: Number, max: 5, min: 0}
	},
	comment_time: {type: Date, default: Date.now},
	replies: [{
		reply_text: String,
		reply_author: {
			_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
			username: String
		},
		reply_time: {type: Date, default: Date.now}
	}],
});

commentSchema
.virtual("commentCreatedAt")
.get(function(){
	return moment(this.comment_time).format("LLLL");
});

module.exports = mongoose.model("Comment", commentSchema);
