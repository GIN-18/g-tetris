class Operator {
  constructor(game) {
    this.game = game;
    this.stopIcon = `<span class="material-icons-round !text-sm !leading-3">pause</span>`;
    this.startIcon = `<span class="material-icons-round !text-sm !leading-3">play_arrow</span>`;

    this.volumeOff = `<span class="material-icons-round !text-sm !leading-3">volume_off</span>`;
    this.volumeUp = `<span class="material-icons-round !text-sm !leading-3">volume_up</span>`;
  }

  // 按钮操作
  buttomMovePiece() {
    document.getElementById("start-btn").addEventListener("touchend", (e) => {
      e.preventDefault();
      if (!this.game.gameStart) {
        this.game.gameStart = true;
        this.changeIcon(
          "start-btn",
          this.game.gameStart,
          this.stopIcon,
          this.startIcon
        );
        this.game.startGame();
        return;
      }

      this.game.gamePaused = !this.game.gamePaused;
      this.changeIcon(
        "start-btn",
        !this.game.gamePaused,
        this.stopIcon,
        this.startIcon
      );
      this.game.setDropTimer();
    });
    document
      .getElementById("volume-btn")
      .addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.game.volumeUp = !this.game.volumeUp;
        this.changeIcon(
          "volume-btn",
          !this.game.volumeUp,
          this.volumeUp,
          this.volumeOff
        );
      });

    document
      .getElementById("restart-btn")
      .addEventListener("touchstart", (e) => {
        e.preventDefault();
        location.reload();
      });

    document
      .getElementById("rotate-btn")
      .addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.game.rotateShape(1);
      });

    document.getElementById("drop-btn").addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.game.dropShape();
    });
    document.getElementById("left-btn").addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.game.moveLeft();
    });
    document.getElementById("right-btn").addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.game.moveRight();
    });
    document.getElementById("down-btn").addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.game.moveDown(true);
    });

    document.getElementById("down-btn").addEventListener("touchend", (e) => {
      e.preventDefault();
      this.game.moveDown(false);
    });
  }

  // 键盘操作
  keyMovePiece() {
    document.body.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "KeyS":
          if (!this.game.gameStart) {
            this.game.startGame();
            this.game.gameStart = true;
          }
          break;
        case "KeyP":
          if (id) {
            this.game.gamePaused = !this.game.gamePaused;
            this.game.setDropTimer();
          }
          this.gameLoop();
          break;
        case "KeyK":
          this.game.rotateShape(1);
          break;
        case "KeyH":
          this.game.moveLeft();
          break;
        case "KeyL":
          this.game.moveRight();
          break;
        case "KeyJ":
          this.game.moveDown(true);
          break;
        case "Space":
          this.game.dropShape();
          break;
      }
    });

    document.body.addEventListener("keyup", (e) => {
      switch (e.code) {
        case "KeyJ":
          this.game.moveDown(false);
          break;
      }
    });
  }

  changeIcon(elementId, status, trueIcon, falseIcon) {
    const parentElement = document.getElementById(elementId);
    if (status) {
      parentElement.innerHTML = trueIcon;
    } else {
      parentElement.innerHTML = falseIcon;
    }
  }
}

module.exports = Operator;
