var express 				= require("express");
var router 					= express.Router({mergeParams: true});
var kimochiController 		= require("../controllers/kimochiController");
var middleware				= require("../middlewares");

//GET request for showing specific kimochi page.
router.get("/:id/details", kimochiController.kimochi_show_get);

//GET request for creating new kimochi page
router.get("/create", middleware.isLoggedIn, kimochiController.kimochi_create_get);

//POST request for creating new kimochi
router.post("/create", middleware.isLoggedIn, kimochiController.kimochi_create_post);

//GET request for updating kimochi page
router.get("/:id/update", middleware.isLoggedIn, middleware.checkKimochiOwnership, 
	kimochiController.kimochi_update_get);

//PUT request for updating kimochi page
router.put("/:id/update", middleware.isLoggedIn, middleware.checkKimochiOwnership, 
	kimochiController.kimochi_update_put);

//DELETE request for deleting kimochi
router.delete("/:id/delete", middleware.isLoggedIn, middleware.checkKimochiOwnership, 
	kimochiController.kimochi_remove_delete);

//PUT requestto rate for kimochi
router.post("/:id/rate", middleware.isLoggedIn, kimochiController.kimochi_rate_post);

module.exports = router;