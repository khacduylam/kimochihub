var express 	= require("express");
var router 		= express.Router();
var async 		= require("async");
var passport	= require("passport");
var User 		= require("../models/user");
var Code 		= require("../models/code");
var middleware 	= require("../middlewares");

//GET request for register page
router.get("/register", function(req, res){
	res.render("user/register");
});

//POST request for register page
router.post("/register", middleware.checkUserRegister, function(req, res){
	async.waterfall([
		function(callback){
			Code.findOne({code: req.body.code}, function(err, foundCode){
				if((err || foundCode) === null || foundCode.used){
					req.flash("message", "Code is invalid or used by another one!");
					callback(new Error("not found"));
				}
				else{
					callback(null, foundCode);
				}
			});
		},
		function(foundCode, callback){
			Code.create({ code: foundCode.generateNewCode },
				function(err){
					if(err){
						req.flash("message", ":( something went wrong!");
						callback(err);
					}
					else{
						foundCode.used = true;
						foundCode.save();
						callback(null);
					}
				});
		}
	], function(err){
		if(err){
			console.log("register: " + err);
			res.redirect("back");
		}
		else{
			let newUser = new User({username: req.body.username});
			User.register(newUser, req.body.password, function(err, user){
				if(err){
					console.log(err);
					req.flash("message", ":( something went wrong!");
					res.redirect("back");
				}
				else{
					passport.authenticate("local")(req, res, function(){
						req.flash("message", "Welcome " + req.user.username);
						res.redirect("/kimochis");
					});
				}
			});	
		}
	});
});

//GET request for login page
router.get("/login", function(req, res){
	res.render("user/login");
});

//POST request to login
router.post("/login", passport.authenticate("local", {
	successRedirect: "/kimochis",
	failureRedirect: "/user/login"
	}), function(req, res){
});

//GET request to log out
router.get("/logout", function(req, res){
	req.logout();
	req.flash("message", "See you again!");
	res.redirect("back");
});

module.exports = router;