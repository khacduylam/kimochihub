var Kimochi          = require("../models/kimochi");
var middleware       = require("../middlewares");
var async            = require("async");

////////////////////////////start kimochis_show_get//////////////////////////////////////
exports.kimochis_show_get = function(req, res){
	if(req.query.ids === undefined || !req.query.ids.length){
		show(req, res);
	}
	else{
		showMore(req, res);
	}
};

//Show kimochis at first.
function show(req, res){
	Kimochi.find({}).sort({kimochi_time: -1}).limit(9).exec(function(err, kimochis){
		if(err || !kimochis.length){
			console.log("show: " + err);
			res.render("error", {errorMessage: "something went wrong!"});
		}
		else{
			res.render("index/kimochis", {kimochis: kimochis});
		}
	});
}

//Show next kimochis.
function showMore(req, res){
	let ids = req.query.ids;
	Kimochi.find({_id: {$nin: ids}}).limit(9).exec(function(err, kimochis){
		if(err){
			console.log("showMore: " + err);
			res.render("error", {errorMessage: "something went wrong!"});
		}
		else{
			res.render("partials/kimochis", {kimochis: kimochis});
		}
	});
}
////////////////////////////  end kimochis_show_get//////////////////////////////////////

////////////////////////////start kimochis_search_get//////////////////////////////////////
exports.kimochis_search_get = function(req, res){
	if(req.query.name === undefined || !req.query.name.length){
		res.redirect("/kimochis");
	}
	else{
		let regex = new RegExp(middleware.escapeRegex(req.query.name), "gi");
		if(req.query.ids === undefined || !req.query.ids.length){
			find(req, res, regex);
		}
		else{
			findMore(req, res, regex);
		}
	}
};

//Find kimochis matched regex(name)
function find(req, res, regex){
	Kimochi.find({name: regex}).limit(9).exec(function(err, kimochis){
		if(err || !kimochis.length){
			console.log("kimochis_search_get: " + err);
			res.render("error", 
				{errorMessage: "not found any kimochi matched " + "\"" + req.query.name + "\""});
		}
		else{
			res.render("index/kimochis", {kimochis: kimochis});
		}
	});
}

//Find more kimochis matched regex(name)
function findMore(req, res, regex){
	let ids = req.query.ids;
	Kimochi.find({name: regex, _id: {$nin: ids}}).limit(9).exec(function(err, kimochis){
		if(err){
			res.render("error", {errorMessage: "something went wrong!"});
		}
		else{
			res.render("partials/kimochis", {kimochis: kimochis});
		}
	});
}
////////////////////////////  end kimochis_search_get//////////////////////////////////////

////////////////////////////start kimochis_filter_get//////////////////////////////////////
exports.kimochis_filter_get = function(req, res){
	let selection = req.query.selection;
	let name = req.query.name;
	let ids = req.query.ids;
	//When slection did not match any slection in (newest, oldest, rating).
	if(selection !== "newest" && selection !== "oldest" && selection !== "rating"){
		return res.render("err", {errorMessage: "something went wrong!"});
	}
	if((name === undefined || !name.length) && (ids === undefined || !ids.length)){
		filter1(req, res, selection);
	}
	if((name === undefined || !name.length) && (ids && ids.length)){
		filter2(req, res, selection, ids);
	}
	if((name && name.length) && (ids === undefined || !ids.length)){
		let regex = new RegExp(middleware.escapeRegex(name), "gi");
		filter3(req, res, selection, regex);
	}
	if((name && name.length) && (ids && ids.length)){
		let regex = new RegExp(middleware.escapeRegex(name), "gi");
		filter4(req, res, selection, ids, regex);
	}
};

//When filtering without searching and ids(id of kimochi which is displaying on client screen).
function filter1(req, res, selection){
	if(selection === "newest"){
		//console.log("1");
		filterNewest1(req, res);
	}
	if(selection === "oldest"){
		//console.log("2");
		filterOldest1(req, res);
	}
	if(selection === "rating"){
		//console.log("3");
		filterRating1(req, res);
	}
}

//When filtering with ids only.
function filter2(req, res, selection, ids){
	if(selection === "newest"){
		//console.log("4");
		filterNewest2(req, res, ids);
	}
	if(selection === "oldest"){
		//console.log("5");
		filterOldest2(req, res, ids);
	}
	if(selection === "rating"){
		//console.log("6");
		filterRating2(req, res, ids);
	}
}

//When filtering with searching only.
function filter3(req, res, selection, regex){
	if(selection === "newest"){
		//console.log("7");
		filterNewest3(req, res, regex);
	}
	if(selection === "oldest"){
		//console.log("8");
		filterOldest3(req, res, regex);
	}
	if(selection === "rating"){
		//console.log("9");
		filterRating3(req, res, regex);
	}
}

//When filtering with both searching and ids.
function filter4(req, res, selection, ids, regex){
	if(selection === "newest"){
		//console.log("10");
		filterNewest4(req, res, ids, regex);
	}
	if(selection === "oldest"){
		//console.log("11");
		filterOldest4(req, res, ids, regex);
	}
	if(selection === "rating"){
		//console.log("12");
		filterRating4(req, res, ids, regex);
	}
}

//Filter by newest first(not includes searching and ids).
function filterNewest1(req, res){
	Kimochi.find({}).sort({kimochi_time: -1}).limit(9).exec(function(err, kimochis){
		if(err || !kimochis.length){
			res.render("error", {errorMessage: "something went wrong!"});
		}
		else{
			res.render("partials/kimochis", {kimochis: kimochis});
		}
	});
}

//Filter by newest first(includes ids only).
function filterNewest2(req, res, ids){
	Kimochi.find({_id: {$nin: ids}}).sort({kimochi_time: -1})
	.limit(9).exec(function(err, kimochis){
		if(err){
			res.render("error", {errorMessage: "something went wrong!"});
		}
		else{
			res.render("partials/kimochis", {kimochis: kimochis});
		}
	});
}

//Filter by newest first(includes searching only).
function filterNewest3(req, res, regex){
	Kimochi.find({name: regex}).sort({kimochi_time: -1}).limit(9)
	.exec(function(err, kimochis){
		if(err){
			res.render("error", {errorMessage: "something went wrong!"});
		}
		else{
			res.render("partials/kimochis", {kimochis: kimochis});
		}
	});
}

//Filter by newest first(includes both ids and regex(name)).
function filterNewest4(req, res, ids, regex){
	Kimochi.find({name: regex, _id: {$nin: ids}}).sort({kimochi_time: -1})
	.limit(9).exec(function(err, kimochis){
		if(err){
			res.render("error", {errorMessage: "something went wrong!"});
		}
		else{
			res.render("partials/kimochis", {kimochis: kimochis});
		}
	});
}

//Filter by oldest first(not includes ids and searching).
function filterOldest1(req, res){
	Kimochi.find({}).sort({kimochi_time: 1}).limit(9).exec(function(err, kimochis){
		if(err || !kimochis.length){
			res.render("error", {errorMessage: "something went wrong!"});
		}
		else{
			res.render("partials/kimochis", {kimochis: kimochis});
		}
	});
}

//Filter by oldest first(includes ids only).
function filterOldest2(req, res, ids){
	Kimochi.find({_id: {$nin: ids}}).sort({kimochi_time: 1})
	.limit(9).exec(function(err, kimochis){
		if(err){
			res.render("error", {errorMessage: "something went wrong!"});
		}
		else{
			res.render("partials/kimochis", {kimochis: kimochis});
		}
	});
}

//Filter by oldest first(includes searching only).
function filterOldest3(req, res, regex){
	Kimochi.find({name: regex}).sort({kimochi_time: 1}).limit(9)
	.exec(function(err, kimochis){
		if(err){
			res.render("error", {errorMessage: "something went wrong!"});
		}
		else{
			res.render("partials/kimochis", {kimochis: kimochis});
		}
	});
}

//Filter by oldest first(includes both ids and searching).
function filterOldest4(req, res, ids, regex){
	Kimochi.find({name: regex, _id: {$nin: ids}}).sort({kimochi_time: 1})
	.limit(9).exec(function(err, kimochis){
		if(err){
			res.render("error", {errorMessage: "something went wrong!"});
		}
		else{
			res.render("partials/kimochis", {kimochis: kimochis});
		}
	});
}

//Filter by high rating(not includes ids and searching).
function filterRating1(req, res){
	Kimochi.find({}).exec(function(err, kimochis){
		if(err || !kimochis.length){
			res.render("error", {errorMessage: "something went wrong!"});
		}
		else{
			kimochis.sort(function(k1, k2){
				return k2.stars - k1.stars;
			});
			res.render("partials/kimochis", {kimochis: kimochis.slice(0, 9)});
		}
	});
}

//Filter by high rating(includes ids only).
function filterRating2(req, res, ids){
	Kimochi.find({_id: {$nin: ids}})
	.exec(function(err, kimochis){
		if(err){
			res.render("error", {errorMessage: "something went wrong!"});
		}
		else{
			kimochis.sort(function(k1, k2){
				return k2.stars - k1.stars;
			});
			res.render("partials/kimochis", {kimochis: kimochis.slice(0, 9)});
		}
	});
}

//Filter by high rating(includes searching only).
function filterRating3(req, res, regex){
	Kimochi.find({name: regex})
	.exec(function(err, kimochis){
		if(err){
			res.render("error", {errorMessage: "something went wrong!"});
		}
		else{
			kimochis.sort(function(k1, k2){
				return k2.stars - k1.stars;
			});
			res.render("partials/kimochis", {kimochis: kimochis.slice(0, 9)});
		}
	});
}

//Filter by high rating(includes both ids and searching).
function filterRating4(req, res, ids, regex){
	Kimochi.find({name: regex, _id: {$nin: ids}}).exec(function(err, kimochis){
		if(err){
			res.render("error", {errorMessage: "something went wrong!"});
		}
		else{
			kimochis.sort(function(k1, k2){
				return k2.stars - k1.stars;
			});
			res.render("partials/kimochis", {kimochis: kimochis.slice(0, 9)});
		}
	});
}

////////////////////////////  end kimochis_filter_get//////////////////////////////////////