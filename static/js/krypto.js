import * as modes from "./modules/modes.js";
/**
 * This script handles all interaction with the webpage
 * it also determines if the player has won based on the moves they've made
 */

//GLOBAL VARIABLES

/**
 * These are elements that I store globally to be used throughout
 * includes the target and the cardContainer from the DOM
 */
var initial_board;
var targetContainer;
var cardsContainer;
var cardContainers;
var cards;
var operations;
var menu_btns;

/**
 * I initialize the global variables that store my info from the server
 */
var mode;
var difficulty;
var target;
var first_hand;
var solution;
var difficulty_rating;
let steps = [];
var first_card; //ugly variable to remember the first card that was selected so operation is done correctly

//EVENT HANDLERS

/**
 * When I open the webpage, attach the web handlers
 */
window.onload = function () {
  //set game mode
  get_game_mode();
  set_game_mode();
  attachEventListeners();

  //show the difficulty menu
  get_difficulty();
};

/**
 * Function to attach buttons to event listeners
 * This is done as a function, instead of globablly, so that
 * it can be recalled each time the board is reset
 * (each time board is reset, hadlers need to be reattached to the dom elements)
 */
function attachEventListeners() {
  //set the dom elements
  /**
   * Header buttons
   */
  document
    .getElementById("instructions")
    .addEventListener("click", show_instructions);
  document
    .getElementById("closebtn")
    .addEventListener("click", close_instructions);

  /**
   * Menu buttons
   */

  // game mode
  //difficulty buttons
  document.getElementById("easy").addEventListener("click", function () {
    set_difficulty("easy");
  });
  document.getElementById("medium").addEventListener("click", function () {
    set_difficulty("medium");
  });
  document.getElementById("hard").addEventListener("click", function () {
    set_difficulty("hard");
  });
  document
    .getElementById("difficulty_menu")
    .addEventListener("click", escape_set_difficulty);
  var rest_of_screen = document.getElementsByClassName("difficulty");
  for (let i = 1; i < rest_of_screen.length; i++) {
    rest_of_screen[i].addEventListener("click", escape_set_difficulty);
  }

  document
    .getElementById("solution")
    .addEventListener("click", escape_solution);

  attachGameListeners();
}

function attachGameListeners() {
  //set the dom elements
  targetContainer = document.getElementById("target");
  cardsContainer = document.getElementById("cardsContainer");
  cardContainers = cardsContainer.getElementsByClassName("cardContainer");
  cards = cardsContainer.getElementsByClassName("card");
  operations = document.getElementsByClassName("operation");
  /**
   * Game buttons
   */

  //deal the cards
  document.getElementById("deal_cards").addEventListener("click", do_ajax);
  //KRYPTO!
  //hack to make computer element not conflict
  if (mode.name == "computer") {
    //when the button is clickable, this is for case of human vs. computer, so call with "user1"
    document
      .getElementById("krypto_btn")
      .addEventListener("click", function () {
        krypto_called("user1");
      });
  }
  //operations
  for (let i = 0; i < operations.length; i++) {
    operations[i].addEventListener("click", function () {
      operation_selected(operations[i]);
    });
  }
  //actions
  document.getElementById("undo").addEventListener("click", undo);
  document.getElementById("reset").addEventListener("click", reset);
  document.getElementById("give_up").addEventListener("click", give_up);
}

//FUNCTIONS

/**
 * Get the game mode based on the url
 */
function get_game_mode() {
  var url = window.location.pathname;
  mode = url.substring(url.indexOf("/", 1) + 1);
}

/**
 * In the menu screen, handle selections of game mode
 * Creates instance of game mode from game mode module
 */
function set_game_mode() {
  if (mode == "practice") {
    mode = new modes.Practice();
  } else if (mode == "versus") {
    mode = new modes.Versus();
  } else if (mode == "computer") {
    mode = new modes.Computer();
  }
}

/**
 * Show difficulty menu and wait for user to respond
 */
function get_difficulty() {
  document.getElementById("difficulty_menu").style.display = "flex";
}

/**
 * Handle the person setting the difficulty level
 * Start the game from this function once difficulty selected!
 */
function set_difficulty(selection) {
  document.getElementById("difficulty_menu").style.display = "none";
  difficulty = selection;

  start_game(difficulty);
}

/**
 * Start the game
 */
function start_game() {
  //set up the game board:
  mode.set_up_board();

  //save the board:
  save_board();
}

/**
 * do ajax uses ajax in order to make a call to the server
 * the server runs my python code which responds with a fresh hand,
 * a solution to that hand,
 * and a difficulty rating
 * all of these are stored in global variables
 */
function do_ajax() {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var gameInfo = JSON.parse(this.responseText);
      target = gameInfo.target;
      first_hand = gameInfo.hand;
      solution = gameInfo.solution;
      difficulty_rating = gameInfo.difficulty_rating;
      if (mode.name == "computer") {
        mode.set_difficulty_rating(difficulty_rating);
      }
      create_solution();

      // Now that I have the game info, it's time to start the game!
      // I can load all the info to the given cards
      deal_cards();
    } else {
    }
  };

  req.open("POST", "/", true);
  req.setRequestHeader(
    "content-type",
    "application/x-www-form-urlencoded;charset=UTF-8"
  );
  req.send("difficulty=" + difficulty);
}

/**
 * When the menu btn is clicked, restore the game board and clean up timers
 */
function menu_btn() {
  restore_board();
  mode.clean_up();
  document.getElementById("gameboard").style.display = "none";
  document.getElementById("menu").style.display = "flex";
  switch_menu_btn();
}

/**
 * If the instructions button is pressed, show the instructions
 */
function show_instructions() {
  document.getElementById("instructions_menu").style.height = "100%";
}

/**
 * Close instructions when close button pressed
 */
function close_instructions() {
  document.getElementById("instructions_menu").style.height = "0%";
}

/**
 * If the person clicks outside of the set difficulty options, it escapes
 */
function escape_set_difficulty() {
  //set the difficulty
  document.getElementById("difficulty_menu").style.display = "none";
}

/**
 * If the person clicks anywehre on the solution page, it exits the solution
 * Restore the board and adjust the points after the solution is shown based on the mode
 */
function escape_solution() {
  //set the difficulty
  document.getElementById("solution").style.display = "none";

  restore_board();

  mode.adjust_points();
}

/**
 * Save the board so it can be restored to this state
 */
function save_board() {
  initial_board = document.getElementById("gameboard").cloneNode(true);
}

/*
 * this function restores the board to it's default settings
 */
function restore_board() {
  //first delete the board
  var board = document.getElementById("gameboard");
  var body = document.getElementById("body");

  body.removeChild(board);
  body.appendChild(initial_board);

  //attach event listeners
  mode.set_elements();
  attachGameListeners();

  //resave the board
  save_board();
}

/**
 * Deal cards, populating the html with cards
 */
function deal_cards() {
  //set the innerHtml of the cards
  targetContainer.innerHTML = target;

  //now we need to create all the new cards
  create_cards(first_hand);

  //initialize steps stack to this hand
  steps = [];
  steps[0] = first_hand;

  //switch the action button to call krypto
  document.getElementById("deal_cards").style.display = "none";
  mode.set_krypto_button();
}

/**
 * Handle user calling krypto, call the method based on the game mode
 * @param {} user that called krypto
 */
function krypto_called(user) {
  mode.krypto_called(user);
}

/**
 * This populates the solution's DOM with the solution for the given hand
 */
function create_solution() {
  //first we should delete any old elements in the card container div
  var solution_steps = document.getElementsByClassName(
    "solutionCardsContainer"
  );
  var ans = solution[0][0];

  for (let i = 0; i < solution_steps.length; i++) {
    var solutionCards =
      solution_steps[i].getElementsByClassName("solutionCard");
    var solutionOperation =
      solution_steps[i].getElementsByClassName("solutionOperation")[0];

    //the first card we need to calculate
    if (i > 0) {
      ans = map_ops(ans, solution[0][i], solution[1][i - 1]);
    }
    solutionCards[0].innerHTML = ans;

    for (let q = 1; q < solutionCards.length; q++) {
      solutionCards[q].innerHTML = solution[0][i + q];
    }

    if (solutionOperation) {
      solutionOperation.innerHTML = solution[1][i];
    }
  }
}

/**
 * this populates the cards in the DOM
 * for the valid hand created on the server side
 * Works by looping through the DOM card Conatiners and calling create_card
 * @param {} hand to be shown
 */
function create_cards(hand) {
  //first we should delete any old elements in the card container div

  for (let i = 0; i < Object.keys(hand).length; i++) {
    while (cardContainers[i].firstElementChild) {
      cardContainers[i].removeChild(cardContainers[i].firstElementChild);
    }
    //have to do hand i+1 because it is in dict, with card numbers as key values
    //only create the card if there is supposed to be one:
    if (hand[i + 1] != null) {
      create_card(hand[i + 1], i);
    }
  }

  //set the cards variable to these new active cards
  cards = cardsContainer.getElementsByClassName("card");
}

/**
 * creates a card in the DOM and attaches an event listener
 * so card can be selected
 * @param {} value of card
 * @param {} card_num in the DOM
 */
function create_card(value, card_num) {
  //create the element
  const new_card = document.createElement("button");
  //append it's innerhtml
  new_card.appendChild(document.createTextNode(value));
  //set the value of the card
  new_card.value = value;
  //set the class (for display purposes)
  new_card.className = "button card";
  //add the event listener
  new_card.addEventListener("click", function () {
    card_selected(new_card);
  });

  //set event listener
  cardContainers[card_num].appendChild(new_card);
}

/**
 * Handles user selecting a card
 * Function assures correct interactions:
 * Can only select one card, then must select an operation
 * then selecting a second card completes the operation
 * @param {} element in DOM of selected card
 */
function card_selected(element) {
  // loop through the cards, we can make up to two cards selected
  // if the person clicks an already selected card, it deactivates it
  // if we have two selected cards, check if there is an selected operation
  // if so, complete the operation
  if (element.classList.contains("selected")) {
    clear_selected("all");
  } else {
    //establish variables for the selected cards and operations
    var selected_cards = document.getElementsByClassName("card selected");
    var selected_ops = document.getElementsByClassName("operation selected");

    //if there are currently no selected cards, go ahead and make this one selected
    if (selected_cards.length == 0) {
      element.classList.add("selected");
      //set this as the firt card in the operation
      first_card = element;
    }
    //if there is a selected card, check if user has already selected an operation
    else if (selected_ops.length == 1) {
      //if they have, go ahead and make this card selected and try to do the operation
      var second_card = element;
      operate(first_card, second_card, selected_ops[0].innerHTML);
    }
    //if they haven't then deactivate the old card and make this one selected
    else {
      clear_selected("cards");
      element.classList.add("selected");
      first_card = element;
    }
  }
}

/**
 * Handles user selecting an operations
 * Function assures correct interactions:
 * Can only select one operation, must have selected a card first
 * @param {} element in DOM of selected operation
 */
function operation_selected(element) {
  // based on a person clicking on an operation, see if it should be made selected
  //first, check that a card has been picked
  // if the person clicks an already selected operation, it deactivates it
  // otherwise it activates the operation, and deactivates all the others
  var selected_cards = document.getElementsByClassName("card selected");
  if (selected_cards.length == 1) {
    if (element.classList.contains("selected")) {
      element.classList.remove("selected");
    } else {
      //make sure all the operations are deactivated
      clear_selected("operations");
      //add the selected to the element we have
      element.classList.add("selected");
    }
  }
}

/**
 * Once the user selects two cards and an operation
 * this method performs the operation
 * This calls one of two functions based on if the operation is valid
 * @param {} first_card in operation
 * @param {} second_card in operation
 * @param {} op the operation (as a string)
 */
function operate(first_card, second_card, op) {
  let first_num = parseInt(first_card.value);
  let second_num = parseInt(second_card.value);
  var output = map_ops(first_num, second_num, op);

  //check if the output is valid
  if (output >= 0 && output % 1 == 0) {
    combine_cards(first_card, second_card, output);
  } else {
    invalid_operation(first_card, second_card);
  }
}

/**
 * This function is called if the operation was valid
 * It combines the two cards into a signle card with the result of the operation
 * It also documents this in the steps taken, allowing the user to reset or undo their moves
 * @param {} first_card selected
 * @param {} second_card selected
 * @param {} output of operation
 */
function combine_cards(first_card, second_card, output) {
  //get rid of the first card
  first_card.remove();

  //make the second card equal to the value of the operation
  second_card.value = output;
  second_card.innerHTML = output;

  //clear selections and reset the cards
  cards = cardsContainer.getElementsByClassName("card");
  clear_selected("all");

  //save this as a step
  steps.push(get_hand());

  //check if the game is over
  if (is_game_over()) {
    if (check_win()) {
      win(second_card);
    } else {
      wrong_answer(second_card);
    }
  }
  //otherwise do nothing
}

/**
 * If an operation was invalid, flash the cards as red to let the user know
 * Then deselect the cards and don't perform the opertion
 * @param {} first_card selected
 * @param {} second_card selected
 */
function invalid_operation(first_card, second_card) {
  first_card.classList.add("invalid");
  second_card.classList.add("invalid");
  let flashCard = setTimeout(() => {
    //flash the cards as a different background color for a split second
    first_card.classList.remove("invalid");
    second_card.classList.remove("invalid");
  }, 500);

  clear_selected("all");
}

/**
 * Get the current hand that is being displayed
 * This function is used to determine which cards are on the table
 * Used to set the hand for a given step
 * @returns the hand at any step
 */
function get_hand() {
  var hand = {};
  for (let i = 0; i < cardContainers.length; i++) {
    if (cardContainers[i].firstElementChild) {
      hand[i + 1] = cardContainers[i].firstElementChild.value;
    } else {
      hand[i + 1] = null;
    }
  }
  return hand;
}

/**
 * clear selected "cards", "operations", or "all" for both
 * @param {} id of selections to be cleared
 */
function clear_selected(id) {
  if (id == "cards") {
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.remove("selected");
    }
  } else if (id == "operations") {
    for (let i = 0; i < operations.length; i++) {
      operations[i].classList.remove("selected");
    }
  } else if (id == "all") {
    clear_selected("cards");
    clear_selected("operations");
  }
}

/**
 * Handles user calling for an undo
 * looks at step object and calls the previous step
 * Then creates these cards
 */
function undo() {
  //make sure there is at least one step, if not, do nothing
  if (steps.length > 1) {
    //go back to previous step and pop
    create_cards(steps[steps.length - 2]);
    steps.pop();
  }
  clear_selected("all");
}

/**
 * This resets the board to the initial hand
 * Function is "export default" so that it is available to other modules
 */
export default function reset() {
  //make sure there is at least one step, if not, do nothing
  if (steps.length > 1) {
    //go back to first step
    create_cards(steps[0]);
    //delete all the other steps:
    while (steps.length > 1) {
      steps.pop();
    }
  }
  clear_selected("all");
}

/**
 * animates the cards flipping
 */
function flipCards() {
  //TODO: flip the cards
}

/**
 * Determines if the user has one card left
 * @returns true if one card remains
 */
function is_game_over() {
  return cards.length == 1;
}

/**
 * This is called if game is over
 * Determines if final card is equal to the target
 * @returns true if player has won
 */
function check_win() {
  return parseInt(cards[0].value) == target;
}

/**
 * If the player won
 * this function flashes the cards as green to show they won
 * restores the board
 * @param {} card
 */
function win(card) {
  //clear the timer right away
  mode.clean_up();

  card.classList.add("correct");
  targetContainer.classList.add("correct");

  //flash the cards as green for one second and then restore the baord
  setTimeout(() => {
    //flash the cards as a different background color for a split second
    card.classList.remove("correct");
    targetContainer.classList.remove("correct");
    restore_board();
    mode.increment_points();
  }, 1000);
}

/**
 * In practice mode, if the person calls give up, this calls the method to show the solution
 */
function give_up() {
  mode.show_solution();
}

/**
 * if the person is at last card, and it is an invalid solution
 * Flash the cards as red for one second
 * @param {} card
 */
function wrong_answer(card) {
  card.classList.add("invalid");
  targetContainer.classList.add("invalid");
  let flashCard = setTimeout(() => {
    //flash the cards as a different background color for a split second
    card.classList.remove("invalid");
    targetContainer.classList.remove("invalid");
  }, 1000);

  clear_selected("all");
}

/**
 * Given two numbers and an operation, as a string,
 * return the value of the operations
 */
function map_ops(num1, num2, op) {
  var output;
  if (op == "+") {
    output = num1 + num2;
  } else if (op == "-") {
    output = num1 - num2;
  } else if (op == "*" || op == "×") {
    output = num1 * num2;
  } else if (op == "÷" || op == "/") {
    output = num1 / num2;
  }
  return output;
}
