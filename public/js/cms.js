$(document).ready(function() {
  // Getting jQuery references to the game status, title, form, and player select
  var statusInput = $("#status");
  var titleInput = $("#title");
  var gameIdInput = $("#game_id");
  var urlInput = $("#url");
  var coverInput = $("#cover");
  var cmsForm = $("#cms");
  var playerSelect = $("#player");
  // Adding an event listener for when the form is submitted
  $(cmsForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a game)
  var url = window.location.search;
  var gameId;
  var playerId;
  // Sets a flag for whether or not we're updating a game to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the game id from the url
  // In '?game_id=1', gameId is 1
  if (url.indexOf("?game_id=") !== -1) {
    gameId = url.split("=")[1];
    getGameData(gameId, "game");
  }
  // Otherwise if we have an player_id in our url, preset the player select box to be our Player
  else if (url.indexOf("?player_id=") !== -1) {
    playerId = url.split("=")[1];
  }

  // Getting the players, and their games
  getPlayers();

  // A function for handling what happens when the form to create a new game is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the game if we are missing a status, title, or player
    if (selectedGameData === null || !statusInput.val().trim() || !playerSelect.val()) {
      console.log("SOmething other than A");
      return;
    }
    // Constructing a newGame object to hand to the database
    var newGame = {
      title: selectedGameData.name,
      game_id: selectedGameData.id,
      url: selectedGameData.url,
      cover: selectedGameData.cover.url,
      status: statusInput
        .val()
        .trim(),
      PlayerId: playerSelect.val()


    };

    // If we're updating a game run updateGame to update a game
    // Otherwise run submitGame to create a whole new game
    if (updating) {
      newGame.id = gameId;
      updateGame(newGame);
    }
    else {
      submitGame(newGame);
    }
  }

  $("#search").on("click", searchGame);
  
  function searchGame() {
    console.log("A");
    var title = titleInput
      .val()
      .trim();

    $.get("/api/search/" + title, populateList);
  }

  var selectedGameData;

  function populateList(result) {
    console.log(result);
    $(".list").empty;
    
    for (i = 0; i < result.body.length; i ++) {
        var newRow = $("<div>");
        newRow.attr("class", "row");
        var newGamePanel = $("<div>");
        newGamePanel.addClass("panel panel-default");
        var newGamePanelHeading = $("<div>");
        newGamePanelHeading.addClass("panel-heading");
        var newGameCover = $("<img>");
        newGameCover.attr("src", result.body[i].cover.url + " ");
        newGameCover.attr("class", "col-sm");
        var newGameTitle = $("<div>");
        newGameTitle.attr("class", "col-sm");
        newGameTitle.text(result.body[i].name + " ");
    
        newRow.append(newGameCover);
        newRow.append(newGameTitle);
        newGamePanelHeading.append(newRow);
        newGamePanel.append(newGamePanelHeading);
        newGamePanel.data("gameData", result.body[i]);

        newGamePanel.on("click", function() {
          console.log($(this).data("gameData"));
          $(".panel").css("border", "")
          $(this).css("border", "5px solid blue");

          selectedGameData = $(this).data("gameData");
        });
        
        $(".list").append(newGamePanel); 
    }
  }

  // Submits a new game and brings user to list page upon completion
  function submitGame(game) {
    // check that selectedGameData is set here

    // post data to API

    $.post("/api/games", game, function() {
      window.location.href = "/list?player_id=" + playerId;
    });
  }

  // Gets game data for the current game if we're editing, or if we're adding to an player's existing games
  function getGameData(id, type) {
    var queryUrl;
    switch (type) {
      case "game":
        queryUrl = "/api/games/" + id;
        break;
      case "player":
        queryUrl = "/api/players/" + id;
        break;
      default:
        return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.PlayerId || data.id)
        // If this game exists, prefill our cms forms with its data
        titleInput.val(data.title);
        statusInput.val(data.status);
        playerId = data.PlayerId || data.id;
        // If we have a game with this id, set a flag for us to know to update the game
        // when we hit submit
        updating = true;
      }
    });
  }

  // A function to get Players and then render our list of Players
  function getPlayers() {
    $.get("/api/players", renderPlayerList);
  }
  // Function to either render a list of players, or if there are none, direct the user to the page
  // to create an player first
  function renderPlayerList(data) {
    if (!data.length) {
      window.location.href = "/players";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createPlayerRow(data[i]));
    }
    playerSelect.empty();
    console.log(rowsToAdd);
    console.log(playerSelect);
    playerSelect.append(rowsToAdd);
    playerSelect.val(playerId);
  }

  // Creates the player options in the dropdown
  function createPlayerRow(player) {
    var listOption = $("<option>");
    listOption.attr("value", player.id);
    listOption.text(player.name);
    return listOption;
  }

  // Update a given game, bring user to the list page when done
  function updateGame(game) {
    $.ajax({
      method: "PUT",
      url: "/api/games",
      data: game
    })
    .done(function() {
      window.location.href = "/list";
    });
  }
});
