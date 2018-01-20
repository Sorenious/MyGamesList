$(document).ready(function() {
  /* global moment */

  // listContainer holds all of our games
  //var listContainer = $(".list-container");
  var inProgress = $(".in-progress");
  var completed = $(".completed");
  var wishList = $(".wishlist");
  var gameCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handleGameDelete);
  $(document).on("click", "button.edit", handleGameEdit);
  // Variable to hold our games
  var games;

  // The code below handles the case where we want to get list games for a specific player
  // Looks for a query param in the url for player_id
  var url = window.location.search;
  var playerId;
  if (url.indexOf("?player_id=") !== -1) {
    playerId = url.split("=")[1];
    getGames(playerId);
  }
  // If there's no playerId we just get all games as usual
  else {
    getGames();
  }


  // This function grabs games from the database and updates the view
  function getGames(player) {
    playerId = player || "";
    if (playerId) {
      playerId = "/?player_id=" + playerId;
    }
    $.get("/api/games" + playerId, function(data) {
      console.log("Games", data);
      games = data;
      if (!games || !games.length) {
        displayEmpty(player);
      }
      else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete games
  function deleteGame(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/games/" + id
    })
    .done(function() {
      getGames(gameCategorySelect.val());
    });
  }

  // InitializeRows handles appending all of our constructed game HTML inside listContainer
  function initializeRows() {
    //listContainer.empty();
    var inProgressGames = [];
    var completedGames = [];
    var wishListGames = [];
    for (var i = 0; i < games.length; i++) {
      if (games[i].status === "in-progress") {
        inProgressGames.push(createNewRow(games[i]));
      } else if (games[i].status === "completed") {
        completedGames.push(createNewRow(games[i]));
      } else {
        wishListGames.push(createNewRow(games[i]));
      }
      //gamesToAdd.push(createNewRow(games[i]));
    }
    inProgress.append(inProgressGames);
    completed.append(completedGames);
    wishList.append(wishListGames);
  }

  // This function constructs a game's HTML
  function createNewRow(game) {
    var formattedDate = new Date(game.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newGamePanel = $("<div>");
    newGamePanel.addClass("panel panel-default");
    var newGamePanelHeading = $("<div>");
    newGamePanelHeading.addClass("panel-heading");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    var newGameTitle = $("<h2>");
    var newGameDate = $("<small>");
    var newGamePlayer = $("<h5>");
    newGamePlayer.text("Written by: " + game.Player.name);
    newGamePlayer.css({
      float: "right",
      color: "blue",
      "margin-top":
      "-10px"
    });
    var newGamePanelStatus = $("<div>");
    newGamePanelStatus.addClass("panel-status");
    var newGameStatus = $("<p>");
    newGameTitle.text(game.title + " ");
    newGameStatus.text(game.status);
    newGameDate.text(formattedDate);
    newGameTitle.append(newGameDate);
    newGamePanelHeading.append(deleteBtn);
    newGamePanelHeading.append(editBtn);
    newGamePanelHeading.append(newGameTitle);
    newGamePanelHeading.append(newGamePlayer);
    newGamePanelStatus.append(newGameStatus);
    newGamePanel.append(newGamePanelHeading);
    newGamePanel.append(newGamePanelStatus);
    newGamePanel.data("game", game);
    return newGamePanel;
  }

  // This function figures out which game we want to delete and then calls deleteGame
  function handleGameDelete() {
    var currentGame = $(this)
      .parent()
      .parent()
      .data("game");
    deleteGame(currentGame.id);
  }

  // This function figures out which game we want to edit and takes it to the appropriate url
  function handleGameEdit() {
    var currentGame = $(this)
      .parent()
      .parent()
      .data("game");
    window.location.href = "/cms?game_id=" + currentGame.id;
  }

  // This function displays a messgae when there are no games
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for Player #" + id;
    }
    listContainer.empty();
    var messageh2 = $("<h2>");
    messageh2.css({ "text-align": "center", "margin-top": "50px" });
    messageh2.html("No games yet" + partial + ", navigate <a href='/cms" + query +
    "'>here</a> in order to get started.");
    listContainer.append(messageh2);
  }

});
