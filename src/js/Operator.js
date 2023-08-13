class Operator {
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
    let pauseIcon = `<svg t="1691818297356" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8616" width="14" height="14"><path d="M341.333333 128c-70.688 0-128 57.312-128 128v512c0 70.688 57.312 128 128 128s128-57.312 128-128V256c0-70.688-57.312-128-128-128z m42.666667 640a42.666667 42.666667 0 0 1-85.333333 0V256a42.666667 42.666667 0 0 1 85.333333 0v512z m298.666667-640c-70.688 0-128 57.312-128 128v512c0 70.688 57.312 128 128 128s128-57.312 128-128V256c0-70.688-57.312-128-128-128z m42.666666 640a42.666667 42.666667 0 0 1-85.333333 0V256a42.666667 42.666667 0 0 1 85.333333 0v512z" p-id="8617" fill="#c6d0f5"></path></svg>`
    let startIcon = `<svg t="1691818336692" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8866" width="14" height="14"><path d="M256 278.72L644.810667 512 256 745.28V278.72M170.666667 128v768l640-384-640-384z" p-id="8867" fill="#c6d0f5"></path></svg>`

    document.getElementById("r-btn").addEventListener("touchstart", () => {
      event.preventDefault();
      // this.game.rotatePiece();
      this.game.movePiece(0, 0, 1)
    });
    document.getElementById("left-btn").addEventListener("touchstart", () => {
      event.preventDefault();
      this.game.movePiece(-1, 0, 0);
    });
    document.getElementById("right-btn").addEventListener("touchstart", () => {
      event.preventDefault();
      this.game.movePiece(1, 0, 0);
    });
    document.getElementById("bottom-btn").addEventListener("touchstart", () => {
      event.preventDefault();
      this.game.ticker.speed = 18
    });
    document.getElementById("drop-btn").addEventListener("touchstart", () => {
      event.preventDefault();
      this.game.ticker.speed = 100
    });
    document.getElementById("bottom-btn").addEventListener("touchend", () => {
      event.preventDefault();
      this.game.ticker.speed = 1
    });

    // 开始暂停按钮
    let startButton = document.getElementById("start-btn")
    startButton.addEventListener("touchstart", () => {
      this.game.gameStatus = !this.game.gameStatus
    })

    // 重新开始按钮
    document.getElementById("restart-btn").addEventListener("touchstart", ()=>{
      location.reload()
    })
  }

  // 键盘操作
  keyMovePiece() {
    document.body.addEventListener("keydown", (e) => {
      switch (e.code) {
        case this.startKey:
          this.game.gameStatus = !this.game.gameStatus
          break;
        case this.rotateKey:
          this.game.rotatePiece();
          break;
        case this.leftKey:
          this.game.movePiece(-1, 0, 0);
          break;
        case this.rightKey:
          this.game.movePiece(1, 0, 0);
          break;
        case this.bottomKey:
          this.game.ticker.speed = 18
          break;
      }
    });
    document.body.addEventListener("keyup", (e) => {
      switch (e.code) {
        case this.bottomKey:
          this.game.ticker.speed = 1
          break;
      }
    });
  }
}

module.exports = Operator;
