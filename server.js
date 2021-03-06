const express = require('express');
const bodyParser = require('body-parser');
//const MongoClient = require('mongodb').MongoClient;
//var daasUrl = 'mongodb://jats22:jpg308@ds021289.mlab.com:21289/empfeed';
var database = require('./database');
const app = express();
var path = require('path');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname ,'public')));

app.set('view engine','ejs');

app.get('/codes',function(req,res){
	console.log('Get request')
	
	database.connect().then(function(db){
		var collection = db.collection('codes');
		collection.find().toArray(function(err,code){
			if(err) return res.send(err);
			// res.render(__dirname+'public'+'/'+'backbonetut.html');
			res.send(code);
			// res.sendFile(path.join(__dirname , '/app.html'));
		})
	});		
		
	// });
})

app.post('/codes',function(req,res){
	
	console.log("Post request");

	database.connect().then(function(db){
		db.collection('codes').insert(req.body,function(err,result){
			if(err) return res.send(err);
			res.redirect('/');
			console.log('Saved to Database');
			// res.sendStatus(200);
			database.close(db);
		})
	})
	
})

app.put('/codes',function(req,res){
	console.log("Put request");
	database.connect().then(function(db){
		db.collection('codes').findOneAndUpdate(
		{
			Title:req.body.Title
		},
		{ 
			$set:
			{
			code: req.body.code,
			Title: req.body.Title
			}
		},
		{
			sort: {_id:-1},
			upsert: true
		},
		function(err,result){
			if(err) return res.send(err)
			
			console.log('Updated!');
			// res.redirect('/');
			database.close(db);
		}
		)

	})
	
})

app.listen(3000,function(){
		console.log("Listening on 3000");
})
