var Kimochi 		= require("../models/kimochi");
var Comment 		= require("../models/comment");
var async 			= require("async");

exports.kimochi_show_get = function(req, res){
	// console.log("kimochi_show_get");
	Kimochi.findById(req.params.id)
	.populate("comments").exec(function(err, kimochi){
		if(err){
			console.log("kimochi_show_get: " + err);
			req.flash("message", "Oop... something went wrong!");
			res.redirect("/kimochis");
		}
		else{
			res.render("kimochi/show", {kimochi: kimochi});
		}
	});
};

exports.kimochi_create_get = function(req, res){
	// console.log("kimochi_create_get");
	res.render("kimochi/new");
};

exports.kimochi_create_post = function(req, res){
	// console.log("kimochi_create_post");
	Kimochi.create({
		name: req.body.name,
		imageUrl: req.body.imageUrl,
		location: req.body.location,
		description: req.body.description,
		kimochi_author: {_id: req.user, username: req.user.username}
	}, function(err, kimochi){
		if(err){
			console.log("kimochi_create_post: " + err);
			req.flash("message", "kimochi is not created.");
			res.redirect("/kimochis");
		}
		else{
			req.flash("message", "New kimochi has just posted successfully!");
			res.redirect("/kimochis");
		}
	});
};

exports.kimochi_update_get = function(req, res){
	// console.log("kimochi_update_get");
	Kimochi.findById(req.params.id, function(err, kimochi){
		if(err){
			console.log("kimochi_update_get: " + err);
			req.flash("message", ":( not found this kimochi!");
			res.redirect("back");
		}
		else{
			res.render("kimochi/update", {kimochi: kimochi});
		}
	});
};

exports.kimochi_update_put = function(req, res){
	// console.log("kimochi_update_put");
	Kimochi.findByIdAndUpdate(req.params.id, {
		$set: {
			name: req.body.name, 
			imageUrl: req.body.imageUrl,
			location: req.body.location,
			description: req.body.description
		}
	}, {"new": true}, function(err){
		if(err){
			console.log("kimochi_update_put: " + err);
			req.flash("message", "Try it again!");
			res.redirect("back");
		}
		else{
			req.flash("message", "kimochi is updated successfully!");
			res.redirect("../" + req.params.id + "/details");
		}
	});
};

exports.kimochi_remove_delete = function(req, res){
	// console.log("kimochi_remove_delete");
	async.waterfall([
		function(callback){
			Kimochi.findById(req.params.id, function(err, kimochi){
				if(err){
					callback(err);
				}
				else{
					callback(null, kimochi);
				}
			});
		},
		function(kimochi, callback){
			Comment.deleteMany({_id: {$in: kimochi.comments}}, function(err){
				if(err){
					callback(err);
				}
				else{
					callback(null, kimochi);
				}
			});
		},
		function(kimochi, callback){
			Kimochi.deleteOne({_id: kimochi._id}, function(err){
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
			console.log("kimochi_remove_delete: " + err);
			req.flash("message", ":( Ooh... something went wrong!");
			res.redirect("/kimochis");
		}
		else{
			req.flash("message", "kimochi is removed successfully!");
			res.redirect("/kimochis");
		}
	});
};

exports.kimochi_rate_post = function(req, res){
	// console.log("kimochi_rate_post");
	// console.log(req.body);
	Kimochi.findById(req.params.id, function(err, kimochi){
		if(err){
			console.log("kimochi_rate_post: " + err);
			req.flash("message", ":( something went wrong!");
			res.redirect("back");
		}
		else{
			let index = -1;
			index = kimochi.raters.findIndex(function(rater){
				return rater._id.equals(req.user._id);
			});
			if(index === -1){
				let newRater = {
					_id: req.user._id,
					stars: req.body.stars
				};
				kimochi.raters.push(newRater);
				kimochi.save();
			}
			else{
				kimochi.raters[index].stars = req.body.stars;
				kimochi.save();
			}
			res.send("<small>You rated: " + req.body.stars + "/5 stars</small>");
		}
	});
};