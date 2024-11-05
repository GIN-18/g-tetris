export class Timer {
  constructor() {
    this.startTime = null
    this.elapsedTime = 0
    this.intervalId = null
  }

  startSequential(callback) {
    this.startTime = new Date().getTime()
    this.intervalId = setInterval(() => {
      const currentTime = new Date().getTime()
      this.elapsedTime = currentTime - this.startTime
      callback(this.formatTime(this.elapsedTime))
    }, 1) // update every 1 millisecond
  }

  startCountdown(time, callback) {
    this.countdownTime = time
    this.startTime = new Date().getTime()
    this.intervalId = setInterval(() => {
      const currentTime = new Date().getTime()
      this.elapsedTime = currentTime - this.startTime
      const remainingTime = this.countdownTime - this.elapsedTime
      if (remainingTime <= 0) {
        callback('Countdown finished!')
        this.stop()
      } else {
        callback(this.formatTime(remainingTime))
      }
    }, 1) // update every 1 millisecond
  }

  stop() {
    clearInterval(this.intervalId)
    this.intervalId = null
  }

  reset() {
    this.elapsedTime = 0
    this.startTime = null
    this.stop()
  }

  formatTime(time) {
    const minutes = Math.floor(time / (1000 * 60))
    const seconds = Math.floor((time % (1000 * 60)) / 1000)
    const milliseconds = time % 1000
    return `${minutes}:${this.pad(seconds)}\n${this.pad(milliseconds, 3)}`
  }

  pad(number, length = 2) {
    return number.toString().padStart(length, '0')
  }
}
