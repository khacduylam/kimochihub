var express 		= require("express");
var router 			= express.Router();
var Kimochi 		= require("../models/kimochi");

//GET request for index page
router.get("/", function(req ,res){
	res.render("index/index");
});

//GET request for all kimochis
router.get("/kimochis", function(req, res){
	Kimochi.find({}, function(err, kimochis){
		if(err){
			res.send("No kimochi here!");
		}
		else{
			res.render("index/kimochis", {kimochis: kimochis});
		}
	});
});

module.exports = router;