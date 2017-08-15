var keys = require('./keys.js');
var request = require("request");
var twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var timeStamp = new Date().toDateString();
var nodeArgv = process.argv;
var command = process.argv[2]
var userInput = process.argv.slice(3).join("+");

switch(command){
  case "my-tweets":
    tweet();
  break;

  case "spotify-this-song":
    if(userInput){
        spotifySong(userInput); 
    } else{
        spotifySong("The Sign Ace of Base");
    }
  break;

  case "movie-this":
    if(userInput){
      omdbData(userInput);
    } else{
      omdbData("Mr. Nobody");
    }
  break;

  case "do-something":
    doThing();
  break;

  default:
    console.log("{Please enter a command: my-tweets, movie-this, do-something, spotify-this-song}");
  break;
}

function omdbData(movie){
  //run a request to the OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";

  request(queryUrl, function (error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      var body =  JSON.parse(body);
      console.log("\n=====================================================\n");
      console.log("Title of Movie: " + body.Title);
      console.log("Year Released: " + body.Year);
      console.log("IMDB Rating: " + body.Ratings[0].Value);
      console.log("Rotten Tomatoes Rating: " + body.Ratings[1].Value);
      console.log("Country: " + body.Country);
      console.log("Language used: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("\n");
      console.log("=======================================================");

      //adds text to log.txt
      fs.appendFileSync('log.txt', "Title: " + body.Title);
      fs.appendFileSync('log.txt', "Release Year: " + body.Year);
      fs.appendFileSync('log.txt', "IMdB Rating: " + body.Ratings[0].Value);
      fs.appendFileSync('log.txt', "Country: " + body.Country);
      fs.appendFileSync('log.txt', "Language: " + body.Language);
      fs.appendFileSync('log.txt', "Plot: " + body.Plot);
      fs.appendFileSync('log.txt', "Actors: " + body.Actors);
      fs.appendFileSync('log.txt', "Rotten Tomatoes Rating: " + body.Ratings[1].Value);
      fs.appendFileSync('log.txt', "Rotten Tomatoes URL: " + body.tomatoURL);
     
    } else{
      console.log('Error occurred.')
    };
      if(movie === "Mr. Nobody"){
      console.log("-----------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");
      
      // adds text to log.txt
      fs.appendFileSync('log.txt', "-----------------------");
      fs.appendFileSync('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      fs.appendFileSync('log.txt', "It's on Netflix!");
    }
  });
}

// Twitter functions to receive last 20 tweets
function tweet(){

var params = {screen_name: userInput, count: 19};
var client = new twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for(var i = 0; i < tweets.length; i++) {
         // Shows the full response in the terminal
          var twitterTweets = "@" + tweets[i].user.screen_name + ": " + 
          tweets[i].text + "\r\n" + "created: " + tweets[i].created_at;  
          console.log("\n============== Tweet " + [i] + " ======== "+timeStamp+" ======\n");
          console.log(twitterTweets); 
          //log to log.txt file      
          fs.appendFileSync('log.txt', twitterTweets);   
      }
    }  
  });
}

// Spotify song select function
function spotifySong(song){

  var spotify = new Spotify({
  id: keys.spotifyKeys.id,
  secret: keys.spotifyKeys.secret
});

  spotify.search({ type: 'track', query: song}, function(error, data){
   
    if(!error){
      for(var i = 0; i < 1; i++){
        var songData = data.tracks.items[i];
        console.log("\n====================================\n");
        //artist
        console.log("Artist: " + songData.artists[0].name);
        //song name
        console.log("Song: " + songData.name);
        //spotify preview link
        console.log("Preview URL: " + songData.preview_url);
        //album name
        console.log("Album: " + songData.album.name);
        console.log("\n------------------------------------\n");
        
        //adds text to log.txt
        fs.appendFileSync('log.txt', songData.artists[0].name);
        fs.appendFileSync('log.txt', songData.name);
        fs.appendFileSync('log.txt', songData.preview_url);
        fs.appendFileSync('log.txt', songData.album.name);
      }
    } else{
      console.log('Error occurred.');
    }
  });
}

// random function
function doThing(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}