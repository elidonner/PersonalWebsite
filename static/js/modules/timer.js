/**
 * Javscript to handle the timer
 * All of this comes from:
 * https://css-tricks.com/how-to-create-an-animated-countdown-timer-with-html-css-and-javascript/https://css-tricks.com/how-to-create-an-animated-countdown-timer-with-html-css-and-javascript/
 * Changed it to make it into a callable Timer class
 */

//TIMER STUFF

export default class Timer {
  constructor(time){
    // Start with an initial value of 20 seconds
    this.TIME_LIMIT = time;
    // Initially, no time has passed, but this will count up
    // and subtract from the TIME_LIMIT
    this.timePassed = 0;
    this.timeLeft = this.TIME_LIMIT;

    this.timerInterval = null;

    this.FULL_DASH_ARRAY = 282.6;

    // Warning occurs at 10s
    this.WARNING_THRESHOLD = 10;
    // Alert occurs at 5s
    this.ALERT_THRESHOLD = 5;


    this.COLOR_CODES = {
      info: {
        color: "green",
      },
      warning: {
        color: "orange",
        threshold: this.WARNING_THRESHOLD,
      },
      alert: {
        color: "red",
        threshold: this.ALERT_THRESHOLD,
      },
    };

    this.remainingPathColor = this.COLOR_CODES.info.color;
  }


  startTimer() {
    this.timerInterval = setInterval(() => {
      // The amount of time passed increments by one
      this.timePassed = this.timePassed += 1;
      this.timeLeft = this.TIME_LIMIT - this.timePassed;
      // The time left label is updated
      document.getElementById("base-timer-label").innerHTML = this.formatTime();
      this.setCircleDasharray();
      this.setRemainingPathColor(this.timeLeft);
      if(this.timeLeft<=0){
          this.clearTimer();
      }
    }, 1000);
  
  }

  /**
   * Defining this independently lets me call it outside the function
   */
  clearTimer() {
    clearInterval(this.timerInterval);
  }
  
  
  formatTime() {
    // The largest round integer less than or equal to the result of time divided being by 60.
    const minutes = Math.floor(this.timeLeft / 60);
  
    // Seconds are the remainder of the time divided by 60 (modulus operator)
    let seconds = this.timeLeft % 60;
  
    // If the value of seconds is less than 10, then display seconds with a leading zero
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
  
    // The output in MM:SS format
    return `${minutes}:${seconds}`;
  }
  
  
  // Update the dasharray value as time passes, starting with 283
  setCircleDasharray() {
    const circleDasharray = `${(
      this.calculateTimeFraction() * this.FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
  }
  
  
  
  calculateTimeFraction() {
    const rawTimeFraction = this.timeLeft / this.TIME_LIMIT;
    return rawTimeFraction - (1 / this.TIME_LIMIT) * (1 - rawTimeFraction);
  }
  
  
  setRemainingPathColor() {
    const { alert, warning, info } = this.COLOR_CODES;
  
    // If the remaining time is less than or equal to 5, remove the "warning" class and apply the "alert" class.
    if (this.timeLeft <= alert.threshold) {
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove(warning.color);
      document
        .getElementById("base-timer-path-remaining")
        .classList.add(alert.color);
  
      // If the remaining time is less than or equal to 10, remove the base color and apply the "warning" class.
    } else if (this.timeLeft <= warning.threshold) {
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove(info.color);
      document
        .getElementById("base-timer-path-remaining")
        .classList.add(warning.color);
    } else {
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove(warning.color);
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove(alert.color);
      document
        .getElementById("base-timer-path-remaining")
        .classList.add(info.color);
    }
  }

}







