/**
 * This module helps the script run and set up the html for given game modes
 * game modes: practice, computer, versus
 * works using inheritance to limit amount of code
 */
import Timer from "./timer.js";
import { reset, show_solution } from "../krypto.js";
/**
 * Parent class for game modes
 */
class GameMode {
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
        var _a, _b, _c, _d;
        this.timer_container = document.getElementById("timer");
        this.user1.name = "user1";
        this.user1.popup = document.getElementById("popup1");
        this.user1.username = (_a = document
            .getElementById("user1")) === null || _a === void 0 ? void 0 : _a.getElementsByClassName("userName")[0];
        this.user1.element = (_b = document
            .getElementById("user1")) === null || _b === void 0 ? void 0 : _b.getElementsByClassName("points")[0];
        this.user2.name = "user2";
        this.user2.popup = document.getElementById("popup2");
        this.user2.username = (_c = document
            .getElementById("user2")) === null || _c === void 0 ? void 0 : _c.getElementsByClassName("userName")[0];
        this.user2.element = (_d = document
            .getElementById("user2")) === null || _d === void 0 ? void 0 : _d.getElementsByClassName("points")[0];
    }
    set_active_user(user) {
        if (user == "user1") {
            this.active_user = this.user1;
            this.inactive_user = this.user2;
        }
        else {
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
            this.active_user.element.innerHTML = this.active_user.points.toString();
            this.inactive_user.element.innerHTML =
                this.inactive_user.points.toString();
        }
    }
    popup() {
        if (this.active_user) {
            this.active_user.popup.classList.toggle("show");
        }
    }
    disable_cards() {
        var _a;
        const cards = (_a = document
            .getElementById("cardsContainer")) === null || _a === void 0 ? void 0 : _a.getElementsByClassName("card");
        for (let i = 0; i < cards.length; i++) {
            cards[i].disabled = true;
        }
    }
    enable_cards() {
        var _a;
        const cards = (_a = document
            .getElementById("cardsContainer")) === null || _a === void 0 ? void 0 : _a.getElementsByClassName("card");
        for (let i = 0; i < cards.length; i++) {
            cards[i].disabled = false;
            cards[i].classList.add("button");
        }
    }
    throw_unimplemented_error(function_name) {
        throw new Error("child class must implement " + function_name + " method");
    }
    set_up_board() {
        document.getElementById("gameboard").style.display = "flex";
    }
    show_krypto_button() {
        this.throw_unimplemented_error("set_krypto_button()");
    }
    krypto_called(user) {
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
        super.set_up_board();
        this.user1.username.innerHTML = "Total Puzzles";
        this.user2.username.innerHTML = "Puzzles Solved";
        this.user1.element.innerHTML = this.user1.points.toString();
        this.user2.element.innerHTML = this.user2.points.toString();
        this.timer_container.style.display = "none";
    }
    increment_points() {
        this.active_user.points += 1;
        this.inactive_user.points += 1;
        this.show_points();
    }
    decrement_points() {
        this.inactive_user.points += 1;
        this.show_points();
    }
    show_krypto_button() {
        document.getElementById("actions").style.display = "flex";
        document.getElementById("give_up").style.display = "flex";
        this.set_active_user("user2");
        this.enable_cards();
    }
    adjust_shown_points() {
        this.decrement_points();
    }
    krypto_called(user) { }
    reset_timer() {
        // there is no timer in practice mode, so it's just a noop
    }
}
class Computer extends GameMode {
    constructor() {
        super();
        this.name = "computer";
        this.difficulty_rating = null;
        this.person_timer = null;
        this.computer_timer = null;
        this.timer = null;
    }
    set_difficulty_rating(difficulty_rating) {
        this.difficulty_rating = difficulty_rating;
    }
    set_up_board() {
        super.set_up_board();
        this.user1.username.innerHTML = "Human";
        this.user2.username.innerHTML = "Computer";
        this.user1.element.innerHTML = this.user1.points.toString();
        this.user2.element.innerHTML = this.user2.points.toString();
        this.timer_container.style.display = "flex";
    }
    show_krypto_button() {
        document.getElementById("computer_krypto").style.display = "flex";
        this.start_computer_timer();
        this.disable_cards();
    }
    krypto_called(user) {
        document.getElementById("computer_krypto").style.display = "none";
        document.getElementById("actions").style.display = "flex";
        this.set_active_user(user);
        this.popup();
        if (user == "user1") {
            this.enable_cards();
            this.end_computer_timer();
            this.start_person_timer(20);
        }
        else {
            this.computer_called();
        }
    }
    increment_points() {
        super.increment_points();
    }
    decrement_points() {
        this.decrement_points_parent();
    }
    start_person_timer(time) {
        this.timer = new Timer(time);
        this.timer.startTimer();
        this.person_timer = window.setTimeout(() => {
            this.end_person_timer();
            show_solution();
        }, time * 1000);
    }
    end_person_timer() {
        clearTimeout(this.person_timer);
        this.timer.clearTimer();
    }
    computer_called() {
        setTimeout(() => {
            show_solution();
        }, 1000);
    }
    start_computer_timer() {
        this.computer_timer = window.setTimeout(() => {
            console.log("Computer called krypto");
            this.krypto_called("user2");
        }, this.difficulty_rating * 2 * 1000);
    }
    end_computer_timer() {
        clearTimeout(this.computer_timer);
    }
    reset_timer() {
        this.end_computer_timer();
        if (this.timer != null) {
            this.end_person_timer();
        }
    }
    adjust_shown_points() {
        if (this.active_user.name == "user2") {
            this.increment_points();
        }
        else if (this.active_user.name == "user1") {
            this.decrement_points();
        }
    }
}
class Versus extends GameMode {
    constructor() {
        super();
        this.name = "versus";
        this.person_timer = null;
        this.timer = null;
        this.key_handler = this.key_handler.bind(this);
        this.first_attempt = true;
    }
    set_up_board() {
        super.set_up_board();
        this.user1.username.innerHTML = "Player 1";
        this.user2.username.innerHTML = "Player 2";
        this.user1.element.innerHTML = this.user1.points.toString();
        this.user2.element.innerHTML = this.user2.points.toString();
        this.timer_container.style.display = "flex";
    }
    show_krypto_button() {
        document.getElementById("versus_krypto").style.display = "flex";
        document.addEventListener("keyup", this.key_handler);
        this.disable_cards();
    }
    key_handler(e) {
        if (e.code === "KeyA") {
            this.krypto_called("user1");
        }
        else if (e.code === "KeyL") {
            this.krypto_called("user2");
        }
    }
    krypto_called(user) {
        document.getElementById("versus_krypto").style.display = "none";
        document.getElementById("actions").style.display = "flex";
        document.removeEventListener("keyup", this.key_handler);
        this.enable_cards();
        this.set_active_user(user);
        this.popup();
        this.start_person_timer(20);
    }
    increment_points() {
        super.increment_points();
        this.reset_timer();
    }
    decrement_points() {
        this.decrement_points_parent();
    }
    start_person_timer(time) {
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
            this.krypto_called(this.inactive_user.name);
            this.first_attempt = false;
        }
        else {
            this.first_attempt = true;
            this.popup();
            show_solution();
        }
    }
    end_person_timer() {
        clearTimeout(this.person_timer);
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
