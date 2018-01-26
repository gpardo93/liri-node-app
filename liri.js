// Node module imports needed to run the functions
require("dotenv").config();

var fs = require("fs"); //reads and writes files
var request = require("request");
var keys = require("./keys.js");
var twitter = require("twitter");
//var spotify = require ("spotify");
var liriArgument = process.argv[2];



const Spotify = require('node-spotify-api');
const Twitter = require('twitter');

//Install
const client = new Twitter(keys.twitter);
const spotify = new Spotify(keys.spotify);
// ---------------------------------------------------------------------------------------------------------------
// Possible commands for this liri app
switch(liriArgument) {
    case "my-tweets": myTweets(); break;
    case "spotify-this-song": spotifyThisSong(); break;
    case "movie-this": movieThis(); break;
    case "do-what-it-says": doWhatItSays(); break;
    // Instructions displayed in terminal to the user
    default: console.log("\r\n" +"Try typing one of the following commands after 'node liri.js' : " +"\r\n"+
        "1. my-tweets 'any twitter name' " +"\r\n"+
        "2. spotify-this-song 'any song name' "+"\r\n"+
        "3. movie-this 'any movie name' "+"\r\n"+
        "4. do-what-it-says."+"\r\n"+
        "Be sure to put the movie or song name in quotation marks if it's more than one word.");
};
// ---------------------------------------------------------------------------------------------------------------
// Functions
// Movie function, uses the Request module to call the OMDB api
function movieThis(movie) {
	movie = movie || "Mr. Nobody";
	var queryUrl = "https://www.omdbapi.com/?apikey=40e9cece&s=" + movie; // using search because sometimes just getting a movie by name gives strange results
	console.log("Please wait while I find that movie.\n");
	request(queryUrl, function (error, response, body) {
		if (error) {
			console.log("I'm sorry, but I seem to have run into an error.\n  " + error);
			return;
		}
		if (body && JSON.parse(body).Search && JSON.parse(body).Search.length > 0) {
			for (var i = 0; i < JSON.parse(body).Search.length; i++) {
				var result = JSON.parse(body).Search[i];
				if (result.Title.toLowerCase() === movie.toLowerCase()) {
		            var cont = false;
					var innerQueryURL = "https://www.omdbapi.com/?i=" + result.imdbID + "&apikey=40e9cece";
					request(innerQueryURL, function (error, response, body) { // another request because the search result doesn't give enough information
						if (error) {
							console.log("I'm sorry, but I seem to have run into an error.\n  " + error);
							return;
						}
						if (body && JSON.parse(body) && JSON.parse(body).Response === "True") {
							body = JSON.parse(body);
							console.log("I think I found the movie you were looking for. Here's some information on it:\n");
							console.log("  Title: " + body.Title);
							console.log("  Year: " + body.Year);
							for (var j = 0; j < body.Ratings.length; j++) {
								if (body.Ratings[j].Source === "Internet Movie Database") {
									console.log("  IMDB Rating: " + body.Ratings[j].Value);
								} else if (body.Ratings[j].Source === "Rotten Tomatoes") {
									console.log("  Rotten Tomatoes Score: " + body.Ratings[j].Value);
								}
							}
							console.log("  " + (body.Country.indexOf(',') < 0 ? "Country: " : "Countries: ") + body.Country);
							console.log("  " + (body.Language.indexOf(',') < 0 ? "Language: " : "Languages: ") + body.Language);
							console.log("  Actors: " + body.Actors);
							console.log("  Plot: " + body.Plot);
						} else {
							cont = true;
						}
					});
					if (cont) {
						continue;
					}
					return;
				}
			}
			var result = JSON.parse(body).Search[0];
			var innerQueryURL = "https://www.omdbapi.com/?i=" + result.imdbID + "&apikey=40e9cece";
			var ret = false;
			request(innerQueryURL, function (error, response, body) {
				if (error) {
					console.log("I'm sorry, but I seem to have run into an error.\n  " + error);
					return;
				}
				if (body && JSON.parse(body) && JSON.parse(body).Response === "True") {
					body = JSON.parse(body);
					console.log("I couldn't find any movies with that exact title. This was the closest match I could find:\n");
					console.log("  Title: " + body.Title);
					console.log("  Year: " + body.Year);
					for (var j = 0; j < body.Ratings.length; j++) {
						if (body.Ratings[j].Source === "Internet Movie Database") {
							console.log("  IMDB Rating: " + body.Ratings[j].Value);
						} else if (body.Ratings[j].Source === "Rotten Tomatoes") {
							console.log("  Rotten Tomatoes Score: " + body.Ratings[j].Value);
						}
					}
					console.log("  " + (body.Country.indexOf(',') < 0 ? "Country: " : "Countries: ") + body.Country);
					console.log("  " + (body.Language.indexOf(',') < 0 ? "Language: " : "Languages: ") + body.Language);
					console.log("  Actors: " + body.Actors);
					console.log("  Plot: " + body.Plot);
				} else {
					ret = true;
				}
			});
			if (ret) {
				return;
			}
		} else {
			console.log("I'm sorry, I wasn't able to find any movies called '" + movie + "'. Make sure to use the exact name of the movie, otherwise I might not find it!");
		}
	});
};




// Tweet function, uses the Twitter module to call the Twitter api
function myTweets() {
    var client = new twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });
    var twitterUsername = process.argv[3];
    if(!twitterUsername){
        twitterUsername = "Giovanni_Pardo";
    }
    params = {screen_name: twitterUsername};
    client.get("statuses/user_timeline/", params, function(error, data, response){
        if (!error) {
            for(var i = 0; i < data.length; i++) {
                //console.log(response); // Show the full response in the terminal
                var twitterResults = 
                "@" + data[i].user.screen_name + ": " + 
                data[i].text + "\r\n" + 
                data[i].created_at + "\r\n" + 
                "------------------------------ " + i + " ------------------------------" + "\r\n";
                console.log(twitterResults);
                log(twitterResults); // calling log function
            }
        }  else {
            console.log("Error :"+ error);
            return;
        }
    });
}
// Spotify function, uses the Spotify module to call the Spotify api
function spotifyThisSong(songName) {
    var songName = process.argv[3];
    if(!songName){
        songName = 'The Sign Ace of Base';
    }
    params = songName;
    spotify.search({ type: "track", query: params }, function(err, data) {
        if(!err){
            var songInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (songInfo[i] != undefined) {
                    var spotifyResults =
                    "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                    "Song: " + songInfo[i].name + "\r\n" +
                    "Album the song is from: " + songInfo[i].album.name + "\r\n" +
                    "Preview Url: " + songInfo[i].preview_url + "\r\n" + 
                    "------------------------------ " + i + " ------------------------------" + "\r\n";
                    console.log(spotifyResults);
                    log(spotifyResults); // calling log function
                }
            }
        }	else {
            console.log("Error :"+ err);
            return;
        }
    });
};
// Do What It Says function, uses the reads and writes module to access the random.txt file and do what's written in it
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data){
        if (!error) {
            doWhatItSaysResults = data.split(",");
            spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
        } else {
            console.log("Error occurred" + error);
        }
    });
};
// Do What It Says function, uses the reads and writes module to access the log.txt file and write everything that returns in terminal in the log.txt file
function log(logResults) {
  fs.appendFile("log.txt", logResults, (error) => {
    if(error) {
      throw error;
    }
  });
}