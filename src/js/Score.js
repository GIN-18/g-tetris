class Score {
  constructor(){
    this.score = 0;
    this.highScore = localStorage.getItem("highScore") || 0;
  }

  // 更新分数
  updateScore(filledRows, level){
    return filledRows * level * 10;
  }

  // 更新最高分
  updateHighScore(){
    if (this.score > this.highScore) {
      localStorage.setItem("highScore", this.score)
    }
  }
}

module.exports = Score
