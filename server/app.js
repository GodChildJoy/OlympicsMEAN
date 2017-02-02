"use strict";

let express = require("express");
let app = express();

//require mongo connection
let mongoUtil = require('./mongoUtil');
mongoUtil.connect();

//middleware static build in express core: current dir step back 
app.use(express.static(__dirname + "/../client"));
// Middleware for post request body parser
let bodyParser = require("body-parser");
let jsonParser = bodyParser.json();

//end point
app.get("/sports", (request, response) => {
  let sports = mongoUtil.sports();
  sports.find().toArray((err, docs) => {
    if(err) {
      response.sendStatus(400);
    }
    console.log(JSON.stringify(docs));
    // result of map function is array
    let sportNames = docs.map((sport) => sport.name);
    // hard code response without DB
    // response.json(["Cycling", "Weightlifting"]);
    response.json(sportNames);
  });
});

app.get("/sports/:name", (request, response) => {
  let sportName = request.params.name;
  
  let sports = mongoUtil.sports();
  sports.find({name: sportName}).limit(1).next((err, doc) => {
    if(err) {
      response.sendStatus(400);
    }
    console.log("Sport doc: ", doc);
    response.json(doc);
  });

  //console.log("Sport name: ", sportName);
  //   let sport = {
   //   "name": "Cycling",
   //   "goldMedals": [{
   //     "division": "Men's Sprint",
   //     "country": "UK",
   //     "year": 2012
   //   }, {
   //     "division": "Women's Sprint",
   //     "country": "Australia",
   //     "year": 2012
   //   }]
   // };
  //response.json(sport);

});

app.post("/sports/:name/medals", jsonParser, (request, response) => {
  let sportName = request.params.name;
  let newMedal = request.body.medal || {};

  if(!newMedal.division || !newMedal.year || !newMedal.country) {
    response.sendStatus(400);
  }

  let sports = mongoUtil.sports();
  let query = {name: sportName};
  let update = {$push: {goldMedals: newMedal}};

  sports.findOneAndUpdate(query, update, (err, res) => {
    if(err){
      response.sendStatus(400);
    }
    response.sendStatus(201);
  });

  // post endpoint test only without Mongo query
  //console.log("Sport name: ", sportName);
  //console.log("Medal: ", newMedal);
  //response.sendStatus(201);
});

app.listen(8181, () => console.log("Listening on 8181"));