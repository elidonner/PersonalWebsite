/**
 * Typescript to handle the timer
 * All of this comes from:
 * https://css-tricks.com/how-to-create-an-animated-countdown-timer-with-html-css-and-javascript/
 * Changed slightly to make it into a callable Timer class
 */

// TIMER STUFF

export default class Timer {
  private TIME_LIMIT: number;
  private timePassed: number;
  private timeLeft: number;
  private timerInterval: number | null;
  private FULL_DASH_ARRAY: number;
  private WARNING_THRESHOLD: number;
  private ALERT_THRESHOLD: number;
  private COLOR_CODES: { [key: string]: { color: string; threshold?: number } };

  constructor(time: number) {
    this.TIME_LIMIT = time;
    this.timePassed = 0;
    this.timeLeft = this.TIME_LIMIT;
    this.timerInterval = null;
    this.FULL_DASH_ARRAY = 282.6;
    this.WARNING_THRESHOLD = 10;
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
      this.timePassed += 1;
      this.timeLeft = this.TIME_LIMIT - this.timePassed;
      // The time left label is updated
      document.getElementById("base-timer-label")!.innerHTML =
        this.formatTime();
      this.setCircleDasharray();
      this.setRemainingPathColor();
      if (this.timeLeft <= 0) {
        this.clearTimer();
      }
    }, 1000);
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  formatTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    let seconds: number | string = this.timeLeft % 60;
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
  }

  setCircleDasharray() {
    const circleDasharray = `${(
      this.calculateTimeFraction() * this.FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
      .getElementById("base-timer-path-remaining")!
      .setAttribute("stroke-dasharray", circleDasharray);
  }

  calculateTimeFraction(): number {
    const rawTimeFraction = this.timeLeft / this.TIME_LIMIT;
    return rawTimeFraction - (1 / this.TIME_LIMIT) * (1 - rawTimeFraction);
  }

  setRemainingPathColor() {
    const { alert, warning, info } = this.COLOR_CODES;
    const element = document.getElementById("base-timer-path-remaining")!;
    if (this.timeLeft <= alert.threshold!) {
      element.classList.remove(warning.color);
      element.classList.add(alert.color);
    } else if (this.timeLeft <= warning.threshold!) {
      element.classList.remove(info.color);
      element.classList.add(warning.color);
    } else {
      element.classList.remove(warning.color);
      element.classList.remove(alert.color);
      element.classList.add(info.color);
    }
  }
}
