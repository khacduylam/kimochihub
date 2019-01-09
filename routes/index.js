var express 		= require("express");
var router 			= express.Router();
var Kimochi 		= require("../models/kimochi");
var indexController = require("../controllers/indexController");

//GET request for index page
router.get("/", function(req ,res){
	res.render("index/index");
});

//GET request for all kimochis
router.get("/kimochis", indexController.kimochis_show_get);

//GET request to search kimochis.
router.get("/kimochis/search", indexController.kimochis_search_get);

//GET request to filter kimochis.
router.get("/kimochis/filter", indexController.kimochis_filter_get);

module.exports = router;