var Kimochi 		= require("../models/kimochi");
var Comment 		= require("../models/comment");
var User 			= require("../models/user");
var Code 			= require("../models/code");

var middleware = {
	isLoggedIn: function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		req.flash("message", "Please login first!");
		res.redirect("/user/login");
	},

	checkKimochiOwnership: function(req, res, next){
		Kimochi.findById(req.params.id, function(err, kimochi){
			if(err){
				console.log("checkkimochiOwnership: " + err);
				return res.redirect("back");
			}
			else{
				if(kimochi.kimochi_author._id.equals(req.user._id)){
					return next();
				}
				return res.redirect("back");
			}
		});
	},

	checkCommentOwnership: function(req, res, next){
		Comment.findById(req.params.comment_id, function(err, comment){
			if(err){
				console.log("checkCommentOwnership: " + err);
				return res.redirect("back");
			}
			else{
				if(comment.comment_author._id.equals(req.user._id)){
					return next();
				}
				return res.redirect("back");
			}
		});
	},

	checkReplyOwnership: function(req, res, next){
		Comment.findById(req.params.comment_id, function(err, comment){
			if(err){
				console.log("checkReplyOwnership: " + err);
				return res.redirect("back");
			}
			else{
				let index = comment.replies.find(function(reply){
					return reply.reply_author._id === req.user._id;
				});
				if(index === -1){
					return res.redirect("back");
				}
				next();
			}
		});
	},

	checkUserRegister: function(req, res, next){
		console.log(req.body.password);
		console.log(req.body.passwordAgain);
		let pattern= /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
		if (req.body.username.length < 5 || 
			req.body.username.length >20 ||
			req.body.password.length < 5 || 
			pattern.test(req.body.username) || 
			req.body.password !== req.body.passwordAgain){
			req.flash("message", "Register unsuccessfully!");
			return res.redirect("back");
		}
		else{
			User.findOne({username: req.body.username}, function(err, user){
				if(err || user === null){
					return next();
				}
				req.flash("message", "User name has existed!");
				res.redirect("back");
			});
		}
	},

	escapeRegex: function(text) {
	    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	}
}

module.exports = middleware;