var mongoose = require("mongoose");

codeSchema = new mongoose.Schema({
	code: String,
	used: {type: Boolean, default: false}
});

codeSchema
.virtual("newCode")
.get(function(){
	let code = "";
    let possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  	for (var i = 0; i < 10; i++){

  	}
    text += possible.charAt(Math.floor(Math.random() * possible.length));
});

codeSchema
.virtual("generateNewCode")
.get(function(){
	let code = "";
	let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < 7; i++){
		code += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return code;
});

module.exports = mongoose.model("Code", codeSchema);