// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var PORT = process.env.PORT || 3000;

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
var databaseUri = 'mongodb://heroku_qcp99lh2:qvol252f4vup0c0je27aki5n63@ds147884.mlab.com:47884/heroku_qcp99lh2';
// var databaseUri = 'mongodb://localhost/scraper';
if (process.env.MONGODB_URI) { 
  var promise = mongoose.connect(process.env.MONGODB_URI)
} else {
  var promise = mongoose.connect(databaseUri, {
    useMongoClient: true,
  });
}
var db = mongoose.connection;

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", (error) => {
  console.log("Database Error:", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});





// Database configuration
// Save the URL of our database as well as the name of our collection
const databaseUrl = "scraper";
const collections = ["scrapeData"];

// // Use mongojs to hook the database to the db variable
// var db = mongojs(databaseUrl, collections);

// Routing 
// var scraperoutes = require("./routes/scrapecontroller.js");
// app.use('/', scraperoutes);
// app.use('/scraper', scraperoutes);
// app.use('/update', scraperoutes);

// Routes
// 1. At the root path, send a simple hello world message to the browser
app.get("/", (req, res) => {
  res.send("Hello world");
});

// scrape data
app.get("/scraper", (req, res) => {
	request("https://news.ycombinator.com/", (error, response, html) => {
		let $ = cheerio.load(html);
		$(".title").each((i, element) => {
			//parsing HTML
			let title = $(element).children("a").text();
			let link = $(element).children("a").attr("href");
			console.log(title);

			res.json(html)

			if(title && link){
				db.scrapedData.insert({"title": title, "link":link}, (err, inserted) => {
					console.log(inserted); 
				});
			}
		})
	})
	res.send("data inserted");
});

// 2. At the "/all" path, display every entry in the animals collection
app.get("/all", (req, res) => {
  // Query: In our database, go to the collection, then "find" everything
  db.scrapedData.find({}, (err, found) => {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
});

app.listen(PORT, () => {
    console.log("Listening on port: ", PORT);
	});
