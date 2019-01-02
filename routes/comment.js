var express 			= require("express");
var router 				= express.Router({mergeParams: true});
var commentController	= require("../controllers/commentController");
var Kimochi 			= require("../models/kimochi");
var Comment 			= require("../models/comment");
var middleware			= require("../middlewares");

//POST request for creating new comment
router.post("/create", middleware.isLoggedIn, commentController.comment_create_post);

//PUT request for updating comment
router.put("/:comment_id/update", middleware.isLoggedIn, middleware.checkCommentOwnership, 
	commentController.comment_update_put);

//DELETE request for deleting comment
router.delete("/:comment_id/delete", middleware.isLoggedIn, middleware.checkCommentOwnership,
	commentController.comment_remove_delete);

//POST request for creating new reply
router.post("/:comment_id/reply/create", middleware.isLoggedIn, commentController.reply_create_post);

//PUT request for updating reply
router.put("/:comment_id/reply/:reply_id/update", middleware.isLoggedIn, middleware.checkReplyOwnership,
	commentController.reply_update_put);

//DELETE request for deleting reply
router.delete("/:comment_id/reply/:reply_id/delete", middleware.isLoggedIn, middleware.checkReplyOwnership,
	commentController.reply_remove_delete);

module.exports = router;