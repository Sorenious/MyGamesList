// Dependencies
var request = require("request");


module.exports = function(app) {

  // GET route for pulling recent games from steam
  app.get("/api/steam/:steamID/games/recent", function (req, res) {
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
        res.send(steamHttpBody);
    });
  });
}