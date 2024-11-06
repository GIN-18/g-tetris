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
    this.intervalId = null
    this.elapsedTime = 0
    this.countdownTime = 180000 // TODO: 传参设置倒计时时间
  }

  startSequential() {
    this.startTime = new Date().getTime()
    this.intervalId = setInterval(() => {
      const currentTime = new Date().getTime()
      this.elapsedTime = currentTime - this.startTime
    }, 1)
  }

  startCountdown() {
    const countdownTime = this.countdownTime
    this.startTime = new Date().getTime()

    this.intervalId = setInterval(() => {
      const currentTime = new Date().getTime()
      this.elapsedTime = currentTime - this.startTime
      this.countdownTime = countdownTime - this.elapsedTime

      if (this.countdownTime <= 0) {
        this.countdownTime = 0
        this.stopTimer()
      }
    }, 1)
  }

  stopTimer() {
    clearInterval(this.intervalId)
    this.intervalId = null
  }

  resetTimer() {
    this.elapsedTime = 0
    this.startTime = null
    this.stopTimer()
  }
}
