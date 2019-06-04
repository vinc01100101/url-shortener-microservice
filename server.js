require("dotenv").config();
const express = require("express");
const app = express();



app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public/"))
app.use((req,res,next)=>{
	console.log(
		"----------------- \n" +
		req.method + " || " +
		req.path + " || " +
		(req.headers.origin || req.connection.remoteAddress)
	)
	next();
})

app.get('/',(req,res)=>{
	res.sendFile(__dirname + '/view/index.html');
})

const findAndRedirect = require("./find-and-redirect");
app.get('/api/shorturl/:id',(req,res,next)=>{
	findAndRedirect(res,req.params.id);
})

const validateAndSave = require("./validate-and-save");
app.post('/api/shorturl/new',(req,res,next)=>{
	const stringURL = req.body.url;
	validateAndSave(res,stringURL);
})

const port = process.env.PORT;
app.listen(port,()=>{
	console.log("Listening to port: " + port)
})