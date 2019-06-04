const mongoose = require("mongoose");
const collection = require('./GLOBALS').collection;

module.exports = (res,id)=>{
	console.log("connecting to database...")
	mongoose.connect(process.env.DB_URI,{useNewUrlParser:true},()=>{
		collection.findOne({short_url: id},(err,result)=>{
			if(err){
				console.log(err)
			}else{
				if(result != null){
					res.redirect(result.original_url)
				}else{
					console.log("id not yet saved");
					if(!res.headersSent){
						res.set({"Content-Type": "text/html"});
						
						res.send('ID not yet saved to database.<br>To get your short url, please go to: <br>1. <a href="/">Homepage. </a><br>2. Enter your url. <br>3. Click SHOW button.');
					}
				}
			}
		})
	});	
}

