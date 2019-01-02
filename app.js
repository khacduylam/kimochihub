var express 					= require('express');
var app 						= express();
var bodyParser 					= require("body-parser");
var dotenv 						= require('dotenv').config();
var mongodb 					= process.env.local_DB || process.env.prod_DB;
var mongoose 					= require('mongoose');
var session 					= require("express-session");
var passport 					= require("passport");
var LocalStrategy 				= require("passport-local");
var methodOverride 				= require("method-override");
var logger 						= require('morgan');
var flash 						= require("connect-flash");
var User 						= require("./models/user");

//Connect database;
mongoose.connect(mongodb, {useNewUrlParser: true});

//Routers
var indexRouter = require("./routes/index");
var kimochiRouter = require("./routes/kimochi");
var commentRouter = require("./routes/comment");
var userRouter = require("./routes/user");

//Using middlewares
app.use(logger('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(methodOverride("_method"));
app.use(flash());


//=======================//
//PASSPORT CONFIGURATION //
//=======================//
app.use(session({
	secret: "ttavyud",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.message = req.flash("message");
	next();
});

//Routes
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/kimochi", kimochiRouter);
app.use("/kimochi/:id/comment", commentRouter);


app.listen(process.env.local_PORT, function(){
	console.log("Server has started!");
});