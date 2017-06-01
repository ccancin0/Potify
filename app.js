const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

// Init App
const app = express();

const spotifyApi = new SpotifyWebApi({
  clientId:'f42d5d6da51c415586d832d8512a4f77',
  clientSecret:'3f1cbceeae124590b269fc8ec01d23dc'
});

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token is ' + data.body['access_token']);
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong!', err);
  });

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set Static Folder
app.use(express.static(path.join(__dirname, 'static')));

// Body Parser Middleware
// parse application/json
app.use(bodyParser.json())

// Home Route
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/artist', function(req, res) {
  // var link = [];
  if(Object.keys(req.query).length === 0) {
    console.log('query is empty');
    res.render('index');
  } else {
    var artist = req.query.name;
    console.log(artist);
    spotifyApi.searchArtists(artist).then(function(data) {
        console.log('Some information about this user', data.body);
        res.render('artist', {
          info: data.body
          // url: link
        });
      }, function(err) {
        console.log('Something went wrong!', err);
      });
  }
});

app.get('/artist/:id', function(req, res) {
  var artistId = req.params.id;
  spotifyApi.getArtist(artistId).then(function(data) {
    console.log(data.body);

    res.render('profile', {
      info: data.body
    });
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});

app.listen(3000, function(){
  console.log('Server is running...');
});
