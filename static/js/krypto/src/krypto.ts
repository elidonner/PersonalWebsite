import { GameMode, Practice, Computer, Versus } from "./modes.js";
import {
  EMPTY_HAND,
  GameModeDescription,
  Difficulty,
  FiveOptionalCards,
  GameInfo,
  RoundInfo,
} from "./types.js";

/**
 * This script handles all interaction with the webpage
 * it also determines if the player has won based on the moves they've made
 */

// GLOBAL VARIABLE DECLARATION

/**
 * Global dom elements
 */
let initial_board: any;
let target_container: HTMLDivElement;
let cards_container: HTMLDivElement;
let card_containers: HTMLCollectionOf<HTMLDivElement>;
let card_buttons: HTMLCollectionOf<HTMLButtonElement>;
let operation_buttons: HTMLCollectionOf<HTMLDivElement>;

/**
 * Global variables
 */
let game_info: GameInfo = {
  mode_description: GameModeDescription.PRACTICE,
  difficulty: Difficulty.EASY,
};
let mode: GameMode;
let round_info: RoundInfo;
let steps: FiveOptionalCards[] = [];
let first_card: HTMLElement | null = null; // variable to remember the first card that was selected so operation is done in correct order

//EVENT HANDLERS

/**
 * When I open the webpage, attach the web handlers
 */
window.onload = function () {
  get_and_set_game_mode();
  initialize_global_variables();
  attach_event_listeners();

  //show the difficulty menu and wait for user input
  show_difficulty_menu();
};

/**
 * Function to attach buttons to event listeners
 * This is done as a function, instead of globally, so that
 * it can be recalled each time the board is reset
 * (each time board is reset, handlers need to be reattached to the dom elements)
 */
function attach_event_listeners() {
  /**
   * Header buttons
   */
  document
    .getElementById("instructions")!
    .addEventListener("click", show_instructions);
  document
    .getElementById("closebtn")!
    .addEventListener("click", close_instructions);

  /**
   * Menu buttons
   */

  // game mode
  // difficulty buttons
  document.getElementById("easy")!.addEventListener("click", function () {
    set_difficulty_and_start_game(Difficulty.EASY);
  });
  document.getElementById("medium")!.addEventListener("click", function () {
    set_difficulty_and_start_game(Difficulty.MEDIUM);
  });
  document.getElementById("hard")!.addEventListener("click", function () {
    set_difficulty_and_start_game(Difficulty.HARD);
  });
  document
    .getElementById("difficulty_menu")!
    .addEventListener("click", escape_set_difficulty);

  // FIX: should this be here?
  var rest_of_screen = document.getElementsByClassName("difficulty");
  for (let i = 1; i < rest_of_screen.length; i++) {
    rest_of_screen[i].addEventListener("click", escape_set_difficulty);
  }

  document
    .getElementById("solution")!
    .addEventListener("click", escape_solution);
}

function initialize_global_variables() {
  //set the dom elements
  target_container = document.getElementById("target")! as HTMLDivElement;
  cards_container = document.getElementById(
    "cardsContainer"
  )! as HTMLDivElement;
  card_containers = cards_container.getElementsByClassName(
    "cardContainer"
  )! as HTMLCollectionOf<HTMLDivElement>;
  card_buttons = cards_container.getElementsByClassName(
    "card"
  )! as HTMLCollectionOf<HTMLButtonElement>;
  operation_buttons = document.getElementsByClassName(
    "operation"
  )! as HTMLCollectionOf<HTMLDivElement>;

  /**
   * Game buttons
   */

  document.getElementById("deal_cards")!.addEventListener("click", do_ajax);

  // KRYPTO! button
  // hack to make computer element not conflict
  if (mode instanceof Computer) {
    // when the button is clickable, this is for case of human vs. computer, so call with "user1"
    document
      .getElementById("krypto_btn")!
      .addEventListener("click", function () {
        krypto_called("user1");
      });
  }

  // operations
  for (let i = 0; i < operation_buttons.length; i++) {
    operation_buttons[i].addEventListener("click", function () {
      operation_selected(operation_buttons[i]);
    });
  }

  //actions
  document.getElementById("undo")!.addEventListener("click", undo);
  document.getElementById("reset")!.addEventListener("click", reset);
  document.getElementById("give_up")!.addEventListener("click", give_up);
}

//FUNCTIONS

/**
 * Get the game mode based on the url
 */
function get_and_set_game_mode(): void {
  var url = window.location.pathname;
  let game_mode = url.substring(url.indexOf("/", 1) + 1);
  set_game_mode(game_mode);
}

/**
 * From home page, handle selections of game mode
 * Creates instance of game mode from game mode module
 */
function set_game_mode(game_mode: string): void {
  switch (game_mode) {
    case GameModeDescription.PRACTICE:
      mode = new Practice();
      break;
    case GameModeDescription.VERSUS:
      mode = new Versus();
      break;
    case GameModeDescription.COMPUTER:
      mode = new Computer();
      break;
    default:
      console.error("invalid game mode");
  }
}

function show_difficulty_menu(): void {
  document.getElementById("difficulty_menu")!.style.display = "flex";
}

function hide_difficulty_menu(): void {
  document.getElementById("difficulty_menu")!.style.display = "none";
}

function set_difficulty(difficulty: Difficulty): void {
  game_info.difficulty = difficulty;
}

function start_game() {
  //set up the game board:
  mode.set_up_board();

  //save the board:
  save_board();
}

function set_difficulty_and_start_game(difficulty: Difficulty) {
  set_difficulty(difficulty);
  hide_difficulty_menu();
  start_game();
}

/**
 * do ajax uses ajax in order to make a call to the server
 * the server runs python code which responds with:
 * a fresh hand,
 * a solution to that hand,
 * a difficulty rating for the hand
 * all of these are stored in global variables
 */
function do_ajax() {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // the python and round_info are made to match via types.py/ts files
      round_info = JSON.parse(this.responseText) as RoundInfo;
      if (mode instanceof Computer) {
        mode.set_difficulty_rating(round_info.difficulty_rating);
      }
      create_solution_dom();

      // Now that I have the round info, it's time to start the round!
      // I can load all the info to the given cards
      deal_cards();
    }
  };

  req.open("POST", "/", true);
  req.setRequestHeader(
    "content-type",
    "application/x-www-form-urlencoded;charset=UTF-8"
  );
  req.send("difficulty=" + game_info.difficulty);
}

function show_instructions() {
  document.getElementById("instructions_menu")!.style.height = "100%";
}

/**
 * Close instructions when close button pressed
 */
function close_instructions() {
  document.getElementById("instructions_menu")!.style.height = "0%";
}

/**
 * If the person clicks outside of the set difficulty options, it escapes
 */
function escape_set_difficulty() {
  //set the difficulty
  document.getElementById("difficulty_menu")!.style.display = "none";
}

/**
 * If the person clicks anywhere on the solution page, it exits the solution
 * Restore the board and adjust the points after the solution is shown based on the mode
 */
function escape_solution() {
  //set the difficulty
  document.getElementById("solution")!.style.display = "none";

  restore_board();

  mode.adjust_shown_points();
}

/**
 * Save the board so it can be restored to this state
 */
function save_board() {
  initial_board = document.getElementById("gameboard")!.cloneNode(true);
}

/*
 * this function restores the board to its default settings
 */
function restore_board() {
  //first delete the board
  var board = document.getElementById("gameboard")!;
  var body = document.getElementById("body")!;

  body.removeChild(board);
  body.appendChild(initial_board);

  // reset variables and elements
  mode.set_elements();
  initialize_global_variables();

  //resave the board
  save_board();
}

/**
 * Deal cards, populating the html with cards
 */
function deal_cards(): void {
  //set the innerHtml of the cards
  target_container.innerHTML = round_info.target.toString();

  //now we need to create all the new cards
  populate_card_numbers(round_info.starting_hand);

  //initialize steps stack to this hand
  steps = [];
  steps[0] = round_info.starting_hand;

  //switch the action button to call krypto
  document.getElementById("deal_cards")!.style.display = "none";
  mode.show_krypto_button();
}

/**
 * Handle user calling krypto, call the method based on the game mode
 * @param {} user that called krypto
 */
function krypto_called(user: string) {
  mode.krypto_called(user);
}

/**
 * This populates the solution's DOM with the solution for the given hand
 */
function create_solution_dom() {
  // First, we should delete any old elements in the solutions container div
  var solution_steps = document.getElementsByClassName(
    "solutionCardsContainer"
  );
  var ans = round_info.solution.organized_cards[0];
  for (let i = 0; i < solution_steps.length; i++) {
    var solutionCards =
      solution_steps[i].getElementsByClassName("solutionCard");
    var solutionOperation =
      solution_steps[i].getElementsByClassName("solutionOperation")[0];

    // The first card we need to calculate
    if (i > 0) {
      ans = map_ops(
        ans,
        round_info.solution.organized_cards[i],
        round_info.solution.operations[i - 1]
      );
    }
    solutionCards[0].innerHTML = ans.toString();

    for (let q = 1; q < solutionCards.length; q++) {
      solutionCards[q].innerHTML =
        round_info.solution.organized_cards[i + q].toString();
    }

    if (solutionOperation) {
      solutionOperation.innerHTML =
        round_info.solution.operations[i].toString();
    }
  }
}

/**
 * This populates the cards in the DOM
 * for the valid hand created on the server side
 * Works by looping through the DOM card containers and calling create_card
 * @param cards to be shown
 */
function populate_card_numbers(cards: FiveOptionalCards) {
  Array.from(card_containers).forEach((container, index) => {
    // First, we should delete any old elements in the card container div
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    if (cards[index] != null) {
      create_card(cards[index]!, index);
    }
  });

  card_buttons = cards_container.getElementsByClassName(
    "card"
  ) as HTMLCollectionOf<HTMLButtonElement>;
}

/**
 * Creates a card in the DOM and attaches an event listener
 * so the card can be selected
 * @param card_value of card
 * @param card_index in the DOM
 */
function create_card(card_value: number, card_index: number) {
  // Create the element
  let card_string = card_value.toString();
  let new_card = document.createElement("button");
  // Append its innerHTML
  new_card.appendChild(document.createTextNode(card_string));
  // Set the value of the card
  new_card.value = card_string;
  new_card.className = "card";
  // Add the event listener
  new_card.addEventListener("click", function () {
    card_selected(new_card);
  });

  // Append the new card to the card container
  card_containers[card_index].appendChild(new_card);
}

/**
 * Handles user selecting a card
 * Function assures correct interactions:
 * Can only select one card, then must select an operation
 * then selecting a second card completes the operation
 * @param {} card in DOM of selected card
 */
function card_selected(card: HTMLButtonElement): void {
  if (card.classList.contains("selected")) {
    clear_all_selected();
    return;
  }

  const selected_cards = document.getElementsByClassName("card selected");
  const selected_ops = document.getElementsByClassName("operation selected");

  if (selected_cards.length === 0) {
    card.classList.add("selected");
    first_card = card;
  } else if (selected_ops.length === 1) {
    operate(first_card as HTMLButtonElement, card, selected_ops[0].innerHTML);
  } else {
    clear_selected_cards();
    card.classList.add("selected");
    first_card = card;
  }
}

/**
 * Handles user selecting an operation
 * Function assures correct interactions:
 * Can only select one operation, must have selected a card first
 * @param {} operation in DOM of selected operation
 */
function operation_selected(operation: HTMLDivElement) {
  // based on a person clicking on an operation, see if it should be made selected
  // first, check that a card has been picked
  // if the person clicks an already selected operation, it deactivates it
  // otherwise it activates the operation, and deactivates all the others
  var selected_cards = document.getElementsByClassName("card selected");
  if (selected_cards.length == 1) {
    if (operation.classList.contains("selected")) {
      operation.classList.remove("selected");
    } else {
      // make sure all the operations are deactivated
      clear_selected_operations();
      // add the selected to the element we have
      operation.classList.add("selected");
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
function operate(
  first_card: HTMLButtonElement,
  second_card: HTMLButtonElement,
  op: string
) {
  let first_num = parseInt(first_card.value);
  let second_num = parseInt(second_card.value);
  var output = map_ops(first_num, second_num, op);

  // check if the output is valid
  if (output >= 0 && output % 1 == 0) {
    combine_cards(first_card, second_card, output);
  } else {
    invalid_operation(first_card, second_card);
  }
}

/**
 * This function is called if the operation was valid
 * It combines the two cards into a single card with the result of the operation
 * It also documents this in the steps taken, allowing the user to reset or undo their moves
 * @param {} first_card selected
 * @param {} second_card selected
 * @param {} output of operation
 */
function combine_cards(
  first_card: HTMLButtonElement,
  second_card: HTMLButtonElement,
  output: number
) {
  //get rid of the first card
  first_card.remove();

  //make the second card equal to the value of the operation
  second_card.value = output.toString();
  second_card.innerHTML = output.toString();

  //clear selections and reset the cards
  card_buttons = cards_container.getElementsByClassName(
    "card"
  ) as HTMLCollectionOf<HTMLButtonElement>;
  clear_all_selected();

  //save this as a step
  steps.push(get_displayed_cards());

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
 * Then deselect the cards and don't perform the operation
 * @param {} first_card selected
 * @param {} second_card selected
 */
function invalid_operation(
  first_card: HTMLButtonElement,
  second_card: HTMLButtonElement
) {
  first_card.classList.add("invalid");
  second_card.classList.add("invalid");
  setTimeout(() => {
    //flash the cards as a different background color for a split second
    first_card.classList.remove("invalid");
    second_card.classList.remove("invalid");
  }, 500);

  clear_all_selected();
}

/**
 * Get the cards that are currently being displayed
 * @returns the hand at any step
 */
function get_displayed_cards(): FiveOptionalCards {
  let displayed_cards: FiveOptionalCards = [...EMPTY_HAND];
  for (let i = 0; i < card_containers.length; i++) {
    let card_container_child = card_containers[i].firstElementChild;
    if (card_container_child) {
      displayed_cards[i] = parseInt(
        (card_container_child as HTMLButtonElement).value
      );
    }
  }
  return displayed_cards;
}

/**
 * clear all selected cards
 */
function clear_selected_cards(): void {
  for (let i = 0; i < card_buttons.length; i++) {
    card_buttons[i].classList.remove("selected");
  }
}

/**
 * clear all selected operations
 */
function clear_selected_operations(): void {
  for (let i = 0; i < operation_buttons.length; i++) {
    operation_buttons[i].classList.remove("selected");
  }
}

/**
 * clear all selected cards and operations
 */
function clear_all_selected(): void {
  clear_selected_cards();
  clear_selected_operations();
}

/**
 * Handles user calling for an undo
 * looks at step object and calls the previous step
 * Then creates these cards
 */
function undo() {
  //make sure there is more than one step, if not, do nothing
  if (steps.length > 1) {
    //go back to previous step and pop
    populate_card_numbers(steps[steps.length - 2]);
    steps.pop();
  }
  clear_all_selected();
}

/**
 * Animates the cards flipping
 */
function flipCards() {
  // TODO: flip the cards
}

/**
 * Determines if the user has one card left
 * @returns true if one card remains
 */
function is_game_over(): boolean {
  return card_buttons.length === 1;
}

/**
 * This is called if the game is over
 * Determines if the final card is equal to the target
 * @returns true if the player has won
 */
function check_win(): boolean {
  return parseInt(card_buttons[0].value!) === round_info.target;
}

/**
 * If the player won
 * This function flashes the cards as green to show they won
 * Restores the board
 * @param card
 */
function win(card: HTMLButtonElement): void {
  // Clear the timer right away
  mode.reset_timer();

  card.classList.add("correct");
  target_container.classList.add("correct");

  // Flash the cards as green for one second and then restore the board
  setTimeout(() => {
    card.classList.remove("correct");
    target_container.classList.remove("correct");
    restore_board();
    mode.increment_points();
  }, 1000);
}

/**
 * In practice mode, if the person calls give up, this calls the method to show the solution
 */
function give_up(): void {
  show_solution();
}

/**
 * If the person is at the last card, and it is an invalid solution
 * Flash the cards as red for one second
 * @param card
 */
function wrong_answer(card: HTMLButtonElement): void {
  card.classList.add("invalid");
  target_container.classList.add("invalid");
  setTimeout(() => {
    // Flash the cards as a different background color for a split second
    card.classList.remove("invalid");
    target_container.classList.remove("invalid");
  }, 1000);

  clear_all_selected();
}

/**
 * Given two numbers and an operation, as a string,
 * return the value of the operation
 * @param num1
 * @param num2
 * @param op
 * @returns the result of the operation
 */
function map_ops(num1: number, num2: number, op: string): number {
  switch (op) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "*":
    case "×":
      return num1 * num2;
    case "÷":
    case "/":
      if (num2 === 0) {
        throw new Error("Division by zero");
      }
      return num1 / num2;
    default:
      throw new Error("Invalid operation");
  }
}

/**
 * Exports
 */

function show_solution(): void {
  document.getElementById("solution")!.style.display = "flex";
}

/**
 * This resets the board to the initial hand
 */
function reset(): void {
  if (steps.length > 1) {
    // Go back to the first step and delete the history of steps
    populate_card_numbers(steps[0]);
    while (steps.length > 1) {
      steps.pop();
    }
  }
  clear_all_selected();
}

export { reset, show_solution };
