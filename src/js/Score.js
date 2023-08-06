class Score {
  constructor(){
    this.score = 0;
    this.highScore = 0;
  }
  // 更新分数
  updateScore(filledRows, level){
    this.score += filledRows * 10 + level * 10;

    switch (filledRows) {
      case 2:
        this.score += 10;
        break;
      case 3:
        this.score += 20;
        break;
      case 4:
        this.score += 30;
        break;
      default:
        this.score += -10;
    }
  }
  // 更新最高分
  updateHighScore(){
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
  }
  // 获取分数
  getScore(){
    return this.score;
  }
}

module.exports = Score
