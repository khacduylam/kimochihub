var Kimochi 		= require("../models/kimochi");
var Comment 		= require("../models/comment");
var async 			= require("async");


exports.comment_create_post = function(req, res){
	// console.log("comment_create_post");
	async.waterfall([
		function(callback){
			Comment.create({
				comment_author: {_id: req.user, username: req.user.username},
		 		comment_text: req.body.comment,
		 		replies: []
			}, function(err, comment){
				if(err){
					callback(err);
				}
				else{
					callback(null, comment._id);
				}
			});
		},
		function(comment_id, callback){
			Kimochi.findByIdAndUpdate(req.params.id, 
				{$push: {comments: comment_id}
			}, {"new": true}, function(err){
					if(err){
						callback(err);
					}
					else{
						callback(null);
					}
				});
		}
	], function(err){
		if(err){
			console.log("comment_create_post: " + err);
			req.flash("message", ":( something went wrong!");
			res.redirect("back");
		}
		else{
			res.redirect("back");
		}
	});
}

exports.comment_update_put = function(req, res){
	// console.log("comment_update_put");
	Comment.findByIdAndUpdate(req.params.comment_id, {
		$set: {
			comment_text: req.body.comment_edit
		}
	}, {"new": true}, function(err, comment){
		if(err){
			console.log("comment_update_put: " + err);
			req.flash("message", ":( something went wrong!");
			res.redirect("back");
		}
		else{
			res.redirect("back");
		}
	});
};

exports.comment_remove_delete = function(req, res){
	// console.log("comment_remove_delete");
	async.waterfall([
		function(callback){
			Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
				if(err){
					callback(err);
				}
				else{
					callback(null, comment);
				}
			});
		},
		function(comment, callback){
			let index = -1;
			Kimochi.findById(req.params.id, function(err, kimochi){
				if(err){
					callback(err);
				}
				else{
					kimochi.comments.forEach(function(com, ind){
						if(com.equals(comment._id)){
							index = ind;
							return;
						}
					});
					if(index !== -1){
						kimochi.comments.splice(index, 1);
						kimochi.save();
					}
					callback(null);
				}
			});
		}
	], function(err){
		if(err){
			console.log("comment_remove_delete: " + err);
			req.flash("message", ":( something went wrong!");
			res.redirect("back");
		}
		else{
			res.redirect("back");
		}
	});
};

exports.reply_create_post = function(req, res){
	// console.log("reply_create_post");
	Comment.findByIdAndUpdate(req.params.comment_id, {
		$push: {
			replies: {
				reply_text: req.body.reply,
				reply_author: {_id: req.user, username: req.user.username},
				reply_time: new Date(Date.now())
			}
		}
	}, {"new": true}, function(err){
		if(err){
			console.log("reply_create_post: " + err);
			req.flash("messgae", ":( something went wrong!");
			res.redirect("back");
		}
		else{
			res.redirect("back");
		}
	});
};

exports.reply_update_put = function(req, res){
	// console.log("reply_update_put");
	Comment.findById(req.params.comment_id, function(err, comment){
		if(err){
			console.log("reply_update_put: " + err);
			req.flash("message", ":( something went wrong!");
			res.redirect("back");
		}
		else{
			let index = comment.replies.findIndex(function(reply){
				console.log(reply._id);
				console.log(req.params.reply_id);
				return reply._id.equals(req.params.reply_id);
			});
			if(index === -1){
				console.log(index);
				req.flash("message", ":( something went wrong!");
				res.redirect("back");
			}
			else{
				comment.replies[index].reply_text = req.body.reply_edit;
				console.log(comment);
				comment.save();
				res.redirect("back");
			}
		}
	});
};

exports.reply_remove_delete = function(req, res){
	// console.log("reply_remove_delete");
	Comment.findById(req.params.comment_id, function(err, comment){
		if(err){
			console.log("reply_remove_delete: " + err);
			req.flash("message", ":( something went wrong!");
			res.redirect("back");
		}
		else{
			let index = comment.replies.findIndex(function(reply){
				console.log(reply._id);
				console.log(req.params.reply_id);
				return reply._id.equals(req.params.reply_id);
			});
			if(index === -1){
				console.log(index);
				req.flash("message", ":( something went wrong!");
				res.redirect("back");
			}
			else{
				comment.replies.splice(index, 1);
				console.log(comment);
				comment.save();
				res.redirect("back");
			}
		}
	});
}