module.exports = function(sequelize, DataTypes) {
  var Player = sequelize.define("Player", {
    // Giving the Player model a name of type STRING
    name: DataTypes.STRING,
    pass: DataTypes.STRING,
    steamID: DataTypes.STRING
  });

  Player.associate = function(models) {
    // Associating Player with Posts
    // When an Player is deleted, also delete any associated Posts
    Player.hasMany(models.Game, {
      onDelete: "cascade"
    });
  };

  return Player;
};
