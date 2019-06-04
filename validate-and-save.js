const dns = require("dns");
const genId = require("gen-id")("nnnna");
const assert = require("assert");
const mongoose = require("mongoose");
mongoose.connection.on('connected', ()=>{console.log('Mongoose connected'); });
mongoose.connection.on('disconnected', ()=>{console.log('Mongoose disconnected'); });
mongoose.connection.on('reconnect', ()=>{console.log('Mongoose reconnected'); });
mongoose.connection.on('error', err=>{console.log('Mongoose connection error: ' + err); }); 

const collection = require('./GLOBALS').collection;

module.exports = (res,stringURL)=>{
	console.log("validating url format: " + stringURL);
	const testString = (/^http(s)?\:\/\/\S*\.\S*/).test(stringURL);
	
	if(testString){
		console.log("PASSED!")
		const testURL = stringURL.match(/^(?:https?:\/\/(\S*\.\S*\.\w*))/);
		
		dns.lookup(testURL[1],(err,addresses,family)=>{
			console.log("validating DNS: " + testURL[1]);
			if(err){
				console.log("not a valid URL")
				if(!res.headersSent)res.json({error: "INVALID URL"})
			}else{
				console.log("PASSED!")
				console.log("address: " + addresses + "/" + family);
				const docURL = {
					original_url: stringURL,
					short_url: parseInt(genId.generate())
				};
				
				saveDoc(docURL);
			};
		});
	}else{
		console.log("NOT A VALID URL STRING")
		res.json({error: "invalid URL"})
	};
	
	function saveDoc(docURL){
		mongoose.connect(process.env.DB_URI, {useNewUrlParser:true},()=>{
			collection.findOne({original_url: docURL.original_url},(err,result)=>{
				if(err){
					console.log(err.message)
				}else{
					if(result != "" && result != null){
						console.log("data already exist");
						res.json({
							original_url: result.original_url,
							short_url: result.short_url
						})
						mongoose.connection.close();
					}else{
						console.log("saving to database...");
						documentEntry = new collection(docURL);
						documentEntry.save((err,result)=>{
							assert.equal(null,err);
							console.log("saved successfully")
							mongoose.connection.close();
						})
						res.json(docURL)
					}
				}
			})
		})
		
		
		
	}
}

