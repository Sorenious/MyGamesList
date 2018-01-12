module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define("Game", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    // game_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false
    // },
    // url: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     len: [1]
    //   }
    // },
    // cover: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     len: [1]
    //   },
    //   defaultValue: "http://online-games.vodacom.co.za/assets/rich/placeholder_games_cover.png"
    // },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [1],
      defaultValue: "wishlist"
    }
  });

  Game.associate = function(models) {
    // We're saying that a Game should belong to an Author
    // A Game can't be created without an Author due to the foreign key constraint
    Game.belongsTo(models.Player, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Game;
};
