// Dependencies
var request = require("request");

var db = require("../models");
const igdb = require('igdb-api-node').default;
const client = igdb('ffb3b6c1f815074d1a524717c119e142');


module.exports = function(app) {

  // GET route for pulling recent games from steam
  app.get("/api/steam/:steamID/games/recent/:playerID", function (req, res) {
    // Steam URL to get recently played games, include API key
    var key = "DB283BA790F74856BE47880482D3845A"
    var queryURL = "http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=" + key + "&steamid=" + req.params.steamID + "&format=json";

    // use `request` package to do GET request to Steam API
    request.get(queryURL, function(error, steamHttpResponse, steamHttpBody) {
        if (error) {
            console.log("Error from Steam API:", err);
            res.status(500).send("Error from Steam");
            return
        }

        // return response from Steam-API to `res`
        res.setHeader('Content-Type', 'application/json');
        //res.send(steamHttpBody);
        console.log(steamHttpBody);
        console.log(JSON.parse(steamHttpBody).response);
        //for (var i = 0; i < JSON.parse(steamHttpBody).response.games.length; i++) {
        client.games({
          fields: ['id', 'name', 'url', 'cover'], // Return all fields
          limit: 1, // Limit to 1 results
          search: JSON.parse(steamHttpBody).response.games[0].name
        }).then(response => {
      // response.body contains the parsed JSON response to this query
            console.log(response);
          db.Game.create({
          title: response.body[0].name,
          game_id: response.body[0].id,
          url: response.body[0].url,
          cover: response.body[0].cover.url,
          status: "in-progress",
          PlayerId: req.params.playerID
        }
            ).then(function(dbGame) {
                console.log(dbGame);
            res.json(dbGame);
          });
        }).catch(error => {
          throw error;
        });
      //}
    });
  });
}