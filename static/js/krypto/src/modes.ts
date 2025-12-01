/**
 * This module helps the script run and set up the html for given game modes
 * game modes: practice, computer, versus
 * works using inheritance to limit amount of code
 */

import Timer from "./timer.js";
import {
  reset,
  show_solution,
  show_operations,
  enable_cards,
  set_up_board,
} from "./krypto.js";

/**
 * Interface for user elements
 */
interface User {
  name: string;
  popup: HTMLElement | null;
  username: HTMLElement | null;
  element: HTMLElement | null;
  points: number;
}

/**
 * Parent class for game modes
 */
class GameMode {
  user1: User;
  user2: User;
  active_user: User | null;
  inactive_user: User | null;
  name: string;
  timer_container: HTMLElement | null;

  constructor() {
    this.user1 = {
      name: "",
      popup: null,
      username: null,
      element: null,
      points: 0,
    };
    this.user2 = {
      name: "",
      popup: null,
      username: null,
      element: null,
      points: 0,
    };
    this.active_user = null;
    this.inactive_user = null;
    this.name = "abstract";
    this.timer_container = null;
    this.set_elements();
  }

  set_elements() {
    this.timer_container = document.getElementById("timer");
    this.user1.name = "user1";
    this.user1.popup = document.getElementById("popup1");
    this.user1.username = document
      .getElementById("user1")
      ?.getElementsByClassName("userName")[0] as HTMLElement;
    this.user1.element = document
      .getElementById("user1")
      ?.getElementsByClassName("points")[0] as HTMLElement;

    this.user2.name = "user2";
    this.user2.popup = document.getElementById("popup2");
    this.user2.username = document
      .getElementById("user2")
      ?.getElementsByClassName("userName")[0] as HTMLElement;
    this.user2.element = document
      .getElementById("user2")
      ?.getElementsByClassName("points")[0] as HTMLElement;
  }

  set_active_user(user: string) {
    if (user == "user1") {
      this.active_user = this.user1;
      this.inactive_user = this.user2;
    } else {
      this.active_user = this.user2;
      this.inactive_user = this.user1;
    }
  }

  increment_points() {
    if (this.active_user) {
      this.active_user.points += 1;
      this.show_points();
    }
  }

  decrement_points_parent() {
    if (this.active_user) {
      this.active_user.points -= 1;
      this.show_points();
    }
  }

  show_points() {
    if (this.active_user && this.inactive_user) {
      this.active_user.element!.innerHTML = this.active_user.points.toString();
      this.inactive_user.element!.innerHTML =
        this.inactive_user.points.toString();
    }
  }

  popup() {
    if (this.active_user) {
      this.active_user.popup!.classList.toggle("show");
    }
  }

  throw_unimplemented_error(function_name: string) {
    throw new Error("child class must implement " + function_name + " method");
  }

  set_up_board() {
    this.throw_unimplemented_error("set_up_board()");
  }

  show_krypto_button() {
    this.throw_unimplemented_error("set_krypto_button()");
  }

  krypto_called(user: string) {
    this.throw_unimplemented_error("krypto_called()");
  }

  adjust_shown_points() {
    this.throw_unimplemented_error("adjust_shown_points()");
  }

  reset_timer() {
    this.throw_unimplemented_error("reset_timer()");
  }
}

class Practice extends GameMode {
  constructor() {
    super();
    this.name = "practice";
  }

  set_up_board() {
    set_up_board();

    this.user1.username!.innerHTML = "Total Puzzles";
    this.user2.username!.innerHTML = "Puzzles Solved";
    this.user1.element!.innerHTML = this.user1.points.toString();
    this.user2.element!.innerHTML = this.user2.points.toString();
    this.timer_container!.style.display = "none";
  }

  increment_points() {
    this.active_user!.points += 1;
    this.inactive_user!.points += 1;
    this.show_points();
  }

  decrement_points() {
    this.inactive_user!.points += 1;
    this.show_points();
  }

  show_krypto_button() {
    document.getElementById("actions")!.style.display = "grid";
    document.getElementById("give_up")!.style.display = "flex";
    this.set_active_user("user2");
    enable_cards();
    show_operations();
  }

  adjust_shown_points() {
    this.decrement_points();
  }

  krypto_called(user: string) {}

  reset_timer() {
    // there is no timer in practice mode, so it's just a noop
  }
}

class Computer extends GameMode {
  person_timer: number | null;
  computer_timer: number | null;
  timer: Timer | null;

  constructor() {
    super();
    this.name = "computer";
    this.person_timer = null;
    this.computer_timer = null;
    this.timer = null;
  }

  set_up_board() {
    set_up_board();

    this.user1.username!.innerHTML = "Human";
    this.user2.username!.innerHTML = "Computer";
    this.user1.element!.innerHTML = this.user1.points.toString();
    this.user2.element!.innerHTML = this.user2.points.toString();
    this.timer_container!.style.display = "flex";
  }

  show_krypto_button() {
    document.getElementById("computer_krypto")!.style.display = "flex";
    document.getElementById("krypto_btn")!.addEventListener("click", () => {
      this.krypto_called("user1");
    });
  }

  krypto_called(user: string) {
    document.getElementById("computer_krypto")!.style.display = "none";
    document.getElementById("actions")!.style.display = "grid";
    this.set_active_user(user);
    this.popup();
    if (user == "user1") {
      enable_cards();
      show_operations();
      this.end_computer_timer();
      this.start_person_timer(20);
    } else {
      this.computer_called();
    }
  }

  increment_points() {
    super.increment_points();
  }

  decrement_points() {
    this.decrement_points_parent();
  }

  start_person_timer(time: number) {
    this.timer = new Timer(time);
    this.timer.startTimer();
    this.person_timer = window.setTimeout(() => {
      this.end_person_timer();
      show_solution();
    }, time * 1000);
  }

  end_person_timer() {
    clearTimeout(this.person_timer!);
    this.timer!.clearTimer();
  }

  computer_called() {
    setTimeout(() => {
      show_solution();
    }, 1000);
  }

  start_computer_timer(difficulty: number) {
    // difficulty score is documented in python backend
    // difficulty is converted to a time the computer should "wait" to call krypto
    // this was just empirically determined
    this.computer_timer = window.setTimeout(() => {
      console.log("Computer called krypto");
      this.krypto_called("user2");
    }, difficulty * 2 * 1000);
  }

  end_computer_timer() {
    clearTimeout(this.computer_timer!);
  }

  reset_timer() {
    this.end_computer_timer();
    if (this.timer != null) {
      this.end_person_timer();
    }
  }

  adjust_shown_points() {
    if (this.active_user!.name == "user2") {
      this.increment_points();
    } else if (this.active_user!.name == "user1") {
      this.decrement_points();
    }
  }
}

class Versus extends GameMode {
  // TODO: refactor this.first_attempt. Very confusing way to do this.
  person_timer: number | null;
  timer: Timer | null;
  first_attempt: boolean;

  constructor() {
    super();
    this.name = "versus";
    this.person_timer = null;
    this.timer = null;
    this.key_handler = this.key_handler.bind(this);
    this.first_attempt = true;
  }

  set_up_board() {
    set_up_board();

    this.user1.username!.innerHTML = "Player 1";
    this.user2.username!.innerHTML = "Player 2";
    this.user1.element!.innerHTML = this.user1.points.toString();
    this.user2.element!.innerHTML = this.user2.points.toString();
    this.timer_container!.style.display = "flex";
  }

  show_krypto_button() {
    document.getElementById("versus_krypto")!.style.display = "flex";
    document.addEventListener("keyup", this.key_handler);
  }

  key_handler(e: KeyboardEvent) {
    if (e.code === "KeyA") {
      this.krypto_called("user1");
    } else if (e.code === "KeyL") {
      this.krypto_called("user2");
    }
  }

  krypto_called(user: string) {
    document.getElementById("versus_krypto")!.style.display = "none";
    document.getElementById("actions")!.style.display = "grid";
    document.removeEventListener("keyup", this.key_handler);
    enable_cards();
    show_operations();
    this.set_active_user(user);
    this.popup();
    this.start_person_timer(20);
  }

  increment_points() {
    super.increment_points();
    this.first_attempt = true;
    this.reset_timer();
  }

  decrement_points() {
    this.decrement_points_parent();
  }

  start_person_timer(time: number) {
    this.timer = new Timer(time);
    this.timer.startTimer();
    this.person_timer = window.setTimeout(() => {
      this.person_lost();
    }, time * 1000);
  }

  person_lost() {
    this.reset_timer();
    if (this.first_attempt) {
      this.decrement_points();
      this.popup();
      reset();
      this.krypto_called(this.inactive_user!.name);
      this.first_attempt = false;
    } else {
      this.first_attempt = true;
      show_solution();
    }
  }

  end_person_timer() {
    clearTimeout(this.person_timer!);
  }

  reset_timer() {
    this.end_person_timer();
    if (this.timer != null) {
      this.timer.clearTimer();
    }
  }

  adjust_shown_points() {
    //this is used after we escaped the solution
    //if the computer was active, add a point
    this.show_points();
  }
}

export { GameMode, Practice, Computer, Versus };
