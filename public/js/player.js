$(document).ready(function() {
  // Getting references to the name inout and player container, as well as the table body
  var nameInput = $("#player-name");
  var passInput = $("#player-pass");
  var steamID = $("#player-steam");
  var playerList = $("#player-list");
  var playerContainer = $(".player-container");
  // Adding event listeners to the form to create a new object, and the button to delete
  // an Player
  $(document).on("submit", "#player-form", handlePlayerFormSubmit);
  $(document).on("click", ".delete-player", handleDeleteButtonPress);

  // Getting the intiial list of Players
  getPlayers();

  // A function to handle what happens when the form is submitted to create a new Player
  function handlePlayerFormSubmit(event) {
    event.preventDefault();
    // Don't do anything if the name fields hasn't been filled out
    if (!nameInput.val().trim().trim()) {
      return;
    }
    // Calling the upsertPlayer function and passing in the value of the name input
    upsertPlayer({
      name: nameInput
        .val()
        .trim(),
      pass: passInput
        .val()
        .trim(),
      steamID: steamID
        .val()
        .trim()
    });
  }

  // A function for creating an player. Calls getPlayers upon completion
  function upsertPlayer(playerData) {
    $.post("/api/players", playerData)
      .then(getPlayers);
  }

  // Function for creating a new list row for players
  function createPlayerRow(playerData) {
    var newTr = $("<tr>");
    newTr.data("player", playerData);
    newTr.append("<td>" + playerData.name + "</td>");
    newTr.append("<td> " + playerData.Games.length + "</td>");
    newTr.append("<td><a href='/list?player_id=" + playerData.id + "'>Go to Games</a></td>");
    newTr.append("<td><a href='/cms?player_id=" + playerData.id + "'>Create a Game</a></td>");
    newTr.append("<td><a style='cursor:pointer;color:red' class='delete-player'>Delete Player</a></td>");
    return newTr;
  }

  // Function for retrieving players and getting them ready to be rendered to the page
  function getPlayers() {
    $.get("/api/players", function(data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createPlayerRow(data[i]));
      }
      renderPlayerList(rowsToAdd);
      nameInput.val("");
      passInput.val("");
      steamID.val("");
    });
  }

  // A function for rendering the list of players to the page
  function renderPlayerList(rows) {
    playerList.children().remove();
    playerContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      playerList.prepend(rows);
    }
    else {
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no players
  function renderEmpty() {
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger");
    alertDiv.text("You must create a Player before you can create a Game.");
    playerContainer.append(alertDiv);
  }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    var listItemData = $(this).parent("td").parent("tr").data("player");
    var id = listItemData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/players/" + id
    })
    .done(getPlayers);
  }
});
