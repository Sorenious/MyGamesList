var db = require("../models");

module.exports = function(app) {
  app.get("/api/players", function(req, res) {
    // 1. Add a join to include all of each Player's Games
    db.Player.findAll({include: [db.Game]}).then(function(dbPlayer) {
      res.json(dbPlayer);
    });
  });

  app.get("/api/players/:id", function(req, res) {
    // 2; Add a join to include all of the Player's Games here
    db.Player.findOne({
      include: [db.Game],
      where: {
        id: req.params.id
      }
    }).then(function(dbPlayer) {
      res.json(dbPlayer);
    });
  });

  app.post("/api/players", function(req, res) {
    db.Player.create(req.body).then(function(dbPlayer) {
      res.json(dbPlayer);
    });
  });

  app.delete("/api/players/:id", function(req, res) {
    db.Player.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbPlayer) {
      res.json(dbPlayer);
    });
  });

};
