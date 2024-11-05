export class Timer {
  static formatMinutesSeconds(time) {
    const minutes = Math.floor(time / (1000 * 60))
    const seconds = Math.floor((time % (1000 * 60)) / 1000)
    return `${Timer.padNumber(minutes)}:${Timer.padNumber(seconds)}`
  }

  static formatMilliseconds(time) {
    const milliseconds = time % 1000
    return `${Timer.padNumber(milliseconds, 3)}`
  }

  static padNumber(number, length = 2) {
    return number.toString().padStart(length, '0')
  }

  constructor() {
    this.startTime = null
    this.elapsed = 0
    this.intervalId = null
  }

  startSequential() {
    this.startTime = new Date().getTime()
    this.intervalId = setInterval(() => {
      const currentTime = new Date().getTime()
      this.elapsed = currentTime - this.startTime
    }, 1)
  }

  startCountdown(time, callback) {
    this.countdownTime = time
    this.startTime = new Date().getTime()
    this.intervalId = setInterval(() => {
      const currentTime = new Date().getTime()
      this.elapsed = currentTime - this.startTime
      const remainingTime = this.countdownTime - this.elapsed
      if (remainingTime <= 0) {
        callback('Countdown finished!')
        this.stopTimer()
      } else {
        callback(Timer.formatTime(remainingTime))
      }
    }, 1)
  }

  stopTimer() {
    clearInterval(this.intervalId)
    this.intervalId = null
  }

  resetTimer() {
    this.elapsed = 0
    this.startTime = null
    this.stopTimer()
  }
}
