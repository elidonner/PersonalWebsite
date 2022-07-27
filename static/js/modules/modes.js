/**
 * This module helps the script run and set up the html for given game modes
 * game modes: practice, computer, versus
 * works using inheritance to limit amount of code
 */


import Timer from "./timer.js";
import reset from "../krypto.js";

/**
 * Parent class for game modes
 */
class GameMode {

  /**
   * Constructor of game mode element
   * Includes the users elements from the DOM
   */
  constructor() {
    this.user1 = {};
    this.user2 = {};
    this.set_elements();
    this.user1["points"] = 0;
    this.user2["points"] = 0;
    this.active_user = null;
    this.inactive_user = null;
  }

  /**
   * This sets the elements in the constructor
   * It is it's own function so that it can be recalled to connect
   * variables to the dom each time the board is reset
   */
  set_elements() {
    this.timer_container = document.getElementById("timer");
    this.user1.name = "user1";
    this.user1.popup = document.getElementById("popup1");
    this.user1.username = document
      .getElementById("user1")
      .getElementsByClassName("userName")[0];
    this.user1.element = document
      .getElementById("user1")
      .getElementsByClassName("points")[0];

    this.user2.name = "user2";
    this.user2.popup = document.getElementById("popup2");
    this.user2.username = document
      .getElementById("user2")
      .getElementsByClassName("userName")[0];
    this.user2.element = document
      .getElementById("user2")
      .getElementsByClassName("points")[0];
  }


  /**
   * method that will be inherited
   */
  set_up_board_parent() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("gameboard").style.display = "flex";
  }

  /**
   * Sets active user (person who called Krypto)
   * @param {} user active user
   */
  set_active_user(user) {
    if (user == "user1") {
      this.active_user = this.user1;
      this.inactive_user = this.user2;
    } else {
      this.active_user = this.user2;
      this.inactive_user = this.user1;
    }
  }


  /**
   * If active user solves, this is called to increment
   */
  increment_points_parent() {
    this.active_user.points += 1;
    this.show_points();
  }

  /**
   * If active user fails, this is called to decrement points
   */
  decrement_points_parent() {
    this.active_user.points -= 1;
    this.show_points();
  }


  /**
   * This method is needed to actually update the points within the html
   */
  show_points() {
    this.active_user.element.innerHTML = this.active_user.points;
    this.inactive_user.element.innerHTML = this.inactive_user.points;
  }

  /**
   * this shows "Krypto!" above the user who calls krypto
   */
  popup() {
    this.active_user.popup.classList.toggle("show");
  }


  /**
   * If the user gives up, or the computer solves, this shows the solution
   */
  show_solution() {
    document.getElementById("solution").style.display = "flex";
  }


  /**
   * This method makes the cards inaccessible for selecting
   * It is needed so that cards are inaccessible until user calls krypto
   */
  disable_cards() {
    var cards = document
      .getElementById("cardsContainer")
      .getElementsByClassName("card");
    for (let i = 0; i < cards.length; i++) {
      cards[i].disabled = true;
    }
  }


  /**
   * This enables the cards for selection after user calls krypto
   */
  enable_cards() {
    var cards = document
      .getElementById("cardsContainer")
      .getElementsByClassName("card");
    for (let i = 0; i < cards.length; i++) {
      cards[i].disabled = false;
    }
  }

  /**
   * This method is redefined within child methods
   * included globally incase it is called for modes that don't define it
   * (modes wihout timers that don't require cleanup)
   */
  clean_up() {}
}







/**
 * This class represents the practice game board
 * Inherits the GameMode class
 */
class Practice extends GameMode {

  constructor() {
    super();
    this.name = "practice";
  }


  /**
   * To set up the practice board, hide the timer
   * and set the respective user titles
   */
  set_up_board() {
    this.set_up_board_parent();

    //set username and points
    this.user1.username.innerHTML = "Total Puzzles";
    this.user2.username.innerHTML = "Puzzles Solved";
    this.user1.element.innerHTML = this.user1.points;
    this.user2.element.innerHTML = this.user2.points;
    //hide the timer
    this.timer_container.style.display = "none";
  }


  /**
   * In practice mode, since we are totalling puzzles solved,
   * each "user" gets a point
   */
  increment_points() {
    this.active_user.points += 1;
    this.inactive_user.points += 1;
    this.show_points();
  }

  /**
   * instead of actually decrementing points, we only increase the
   * total puzzles count (not the puzzles solved count)
   */
  decrement_points() {
    this.inactive_user.points += 1;
    this.show_points();
  }


  /**
   * Practice mode doesn't have a krypto button
   * This just hides the create deck and shows the available actions
   */
  set_krypto_button() {
    document.getElementById("actions").style.display = "flex";
    document.getElementById("give_up").style.display = "flex";
    this.set_active_user("user2");
  }


  /**
   * After the user gives up, and the solution is shown this method is called
   * For practice mode, we just need to "decrement_points"
   */
  adjust_points() {
    //this is used after we escaped the solution
    this.decrement_points();
    }
}




/**
 * This class represents the computer game board
 * For when the user wants to play the computer
 * Inherits the GameMode class
 */
class Computer extends GameMode {



  /**
   * The computer constructor
   * It includes a difficulty rating and timers
   * these are used for the computers "AI"
   */
  constructor() {
    super();
    this.name = "computer";
    this.difficulty_rating = null;
    this.person_timer = null;
    this.computer_timer = null;
    this.timer = null;
  }

  /**
   * Setter for the difficulty rating of the puzzle
   * used to determine how long computer "takes" to solve the puzzle
   * @param {} difficulty_rating of puzzle
   */
  set_difficulty_rating(difficulty_rating) {
    this.difficulty_rating = difficulty_rating;
  }


  /**
   * For computer mode, set respective titles of user
   * show the timer
   */
  set_up_board() {
    this.set_up_board_parent();

    //set username and points
    this.user1.username.innerHTML = "Human";
    this.user2.username.innerHTML = "Computer";
    this.user1.element.innerHTML = this.user1.points;
    this.user2.element.innerHTML = this.user2.points;
    //show the timer
    this.timer_container.style.display = "flex";
  }


  /**
   * Set a single krypto button for the user to call
   * disable the cards until the person calls krypto
   * Also begin the timer for the comptuers "solve time"
   * The computer solves almost instantanesouly
   * the "solve time" is a function of the difficulty rating
   */
  set_krypto_button() {
    document.getElementById("computer_krypto").style.display = "flex";
    this.start_computer_timer();
    //we need to disable event listeners on the cards until krypto is called
    this.disable_cards();
  }


  /**
   * When krypto is called, set the active user
   * if the person called krypto:
   * enable the cards for selection
   * start the html timer to show the user how much time they have
   * start a second timer accessible within this class that determines when the html timer finishes
   * 
   * Finally, show the popup calling krypto
   * @param {} user 
   */
  krypto_called(user) {
    document.getElementById("computer_krypto").style.display = "none";
    document.getElementById("actions").style.display = "flex";
    this.set_active_user(user);
    this.popup();
    if (user == "user1") {
      this.enable_cards();
      this.end_computer_timer();
      this.start_person_timer(20);
    } else {
      this.computer_called();
    }
  }


  /**
   * In computer mode, when we increment points, must clear the timers
   * 
   */
  increment_points() {
    this.increment_points_parent();
  }


  /**
   * Call parent function
   */
  decrement_points() {
    this.decrement_points_parent();
  }


  /**
   * Used to determine if the person's timer has ran out
   * @param {} time 
   */
  start_person_timer(time) {
    //First two lines start the HTML timer
    this.timer = new Timer(time);
    this.timer.startTimer();
    //I start another timer in this method class, to decrement points if the timer ends
    this.person_timer = setTimeout(() => {
      this.end_person_timer();
      this.show_solution();
    }, time * 1000);
  }


  /**
   * end the person timer
   */
  end_person_timer() {
    clearInterval(this.person_timer);
    this.timer.clearTimer();
  }


  /**
   * if the comptuer calls krypto, show the solution
   * Give a little delay though so you can see the computer popup calling krypto
   * using 1 a second delay
   * TODO: add some fade animation into the solution
   */
  computer_called() {
    setTimeout(() => {
      this.show_solution();
    }, 1000);
  }


  /**
   * Start the computer timer once the cards are dealt
   */
  start_computer_timer() {
    //I map the time you get by multiplying the difficulty rating by 3 seconds

    this.computer_timer = setTimeout(() => {
      console.log("Computer called krypto");
      //flash the cards as a different background color for a split second
      this.krypto_called("user2");
    }, this.difficulty_rating * 2 * 1000);
  }


  /**
   * Clears the computer timer
   */
  end_computer_timer() {
    clearInterval(this.computer_timer);
  }


  /**
   * clean up the timers
   * Ends person timer and HTML timer (if it exists)
   */
  //make sure all the timers are turned off
  clean_up() {
    this.end_computer_timer();
    if (this.timer != null) {
      this.end_person_timer();
    }
  }


  /**
   * if the solution is shown,
   * when solution is clicked through,
   * increment computer points if computer solved
   * or decrement human points if human failed to solve
   */
  adjust_points() {
    //this is used after we escaped the solution
    //if the computer was active, add a point
    if (this.active_user.name == "user2") {
      this.increment_points();
    } else if (this.active_user.name == "user1") {
      this.decrement_points();
    }
  }
}






/**
 * This class represents the verus game board
 * For when two users play eachother on same computer
 * Inherits the GameMode class
 */
class Versus extends GameMode {

   /**
   * The versus constructor
   * It includes an html timer
   * it also binds the key handlers
   * includes instance for whether this is the first person to attempt puzzle
   */ 
  constructor() {
    super();
    this.name = "versus";
    this.person_timer = null;
    this.timer = null;
    this.key_handler = this.key_handler.bind(this);
    this.first_attempt = true;
  }


  /**
   * In versus mode, display the timer
   * set respective player titles
   */
  set_up_board() {
    this.set_up_board_parent();

    //set username and points
    this.user1.username.innerHTML = "Player 1";
    this.user2.username.innerHTML = "Player 2";
    this.user1.element.innerHTML = this.user1.points;
    this.user2.element.innerHTML = this.user2.points;
    //show the timer
    this.timer_container.style.display = "flex";
  }


  /**
   * Set the two krypto buttons
   * set up the event listeners on the "krypto keys"
   * Disable the cards for selection until krypto is called
   */
  set_krypto_button() {
    document.getElementById("versus_krypto").style.display = "flex";
    document.addEventListener("keyup", this.key_handler);

    //we need to disable event listeners on the cards until krypto is called
    this.disable_cards();
  }


  /**
   * this sets up the keys A and L for calling krypto
   * We needed to bind this to the constructor, since in the call back function
   * this is lost unless we bind it
   * @param {} e 
   */
  key_handler(e) {
    if (e.code === "KeyA") {
        this.krypto_called("user1");
    } else if (e.code === "KeyL") {
        this.krypto_called("user2");
    }
  }


  /**
   * Sets the active user to the person who calls krypto
   * Begins HTML timer
   * It also displays the popup and enables the cards for selection
   * @param {} user 
   */
  krypto_called(user) {
    document.getElementById("versus_krypto").style.display = "none";
    document.getElementById("actions").style.display = "flex";
    //remove key events for two player mode
    document.removeEventListener("keyup", this.key_handler);
    this.enable_cards();
    this.set_active_user(user);
    this.popup();
    this.start_person_timer(20);
  }


  /**
   * If the active user solves the problem correclty, increment their points
   * clean up the timers
   */
  increment_points() {
    this.increment_points_parent();
    this.clean_up();
  }


  /**
   * If the person fails the puzzle, decrement their points
   */
  decrement_points() {
    this.decrement_points_parent();
  }


  /**
   * Start the timer, both HTML and within this class
   * once person calls krypto
   * @param {} time 
   */
  start_person_timer(time) {
    this.timer = new Timer(time);
    this.timer.startTimer();
    //I start another timer in this method class, to decrement points if the timer ends
    this.person_timer = setTimeout(() => {
      this.person_lost();
    }, time * 1000);
  }


  /**
   * This method handles situation where person fails puzzle
   * if they were first to attempt solving, it gives the other person a chance
   * otherwise, it shows the puzzle solution
   */
  person_lost(){
    this.clean_up();
    if(this.first_attempt){
        this.decrement_points();
        this.popup();
        reset();
        this.krypto_called(this.inactive_user.name)
        this.first_attempt = false;
    } else{
        this.first_attempt = true;
        this.popup();
        this.show_solution();
    }
  }


  /**
   * End the person timer
   */
  end_person_timer() {
    clearInterval(this.person_timer);
  }


  /**
   * make sure all the timers are turned off
   */
  clean_up() {
    this.end_person_timer();
    if (this.timer != null) {
      this.timer.clearTimer();
    }
  }


  /**
   * If the solution was shown, just be sure we show the points that have been adjusted
   */
  adjust_points() {
    //this is used after we escaped the solution
    //if the computer was active, add a point
    this.show_points();
  }
}


/**
 * Export is required within a module to make classes avialable to other modules
 */
export { Practice, Computer, Versus };
