class Operator{
  constructor(game) {
    this.game = game;
    this.rotateKey = "Space";
    this.leftKey = "KeyH";
    this.rightKey = "KeyL";
    this.bottomKey = "KeyJ";
    this.dropKey = "KeyK";
    this.startKey = "KeyS"
    this.buttomMovePiece()
    this.keyMovePiece()
  }

  // 按钮操作
  buttomMovePiece() {
    document.getElementById("r-btn").addEventListener("click", () => {
      this.game.rotatePiece();
    });
    document.getElementById("left-btn").addEventListener("click", () => {
      this.game.movePiece("left");
    });
    document.getElementById("right-btn").addEventListener("click", () => {
      this.game.movePiece("right");
    });
    document.getElementById("bottom-btn").addEventListener("click", () => {
      this.game.movePiece("bottom");
    });
  }

  // 键盘操作
  keyMovePiece() {
    document.body.addEventListener("keydown", (e) => {
      switch (e.code) {
        case this.startKey:
          this.game.gameStart = true
          this.game.init();
          break;
        case this.rotateKey:
          this.game.rotatePiece();
          break;
        case this.leftKey:
          this.game.movePiece("left");
          break;
        case this.rightKey:
          this.game.movePiece("right");
          break;
        case this.bottomKey:
          this.game.dropTime = 100
          break;
      }
    });
  }
}

module.exports = Operator;
