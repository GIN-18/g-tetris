const $ = require("jquery");
const Shape = require("./Shape.js");
const Music = require("./Music.js");
const utils = require("../utils/utils.js");
const socket = require("../utils/socket.js");
const options = require("../utils/options.js");

class Game {
  constructor(mapCtx, nextShapeCtx) {
    this.blockSize = 20;

    this.flavor = sessionStorage.getItem("flavor");

    this.mapCtx = mapCtx;
    this.mapWidth = 10;
    this.mapHeight = 20;
    this.map = [...new Array(this.mapHeight)].map(() =>
      new Array(this.mapWidth).fill(0)
    );

    this.nextShapeCtx = nextShapeCtx;

    this.gameMode = sessionStorage.getItem("gameMode") || "single";

    this.gamePlay = false;
    this.gameOver = false;

    this.music = new Music();
    this.volumeUp = true;

    this.shape = null;
    this.nextShape = new Shape();
    this.previewShape = null;
    this.shapeColor = options.palette[this.flavor].shapeColor;
    this.clearLineColor = options.palette[this.flavor].clearLineColor;
    this.previewShapeColor = options.palette[this.flavor].previewShapeColor;

    this.dropTimer = null;
    this.fastForward = false;

    this.level = 1;

    this.score = 0;
    this.highScore = localStorage.getItem("highScore") || 0;

    this.init();
  }

  // 初始化
  init() {
    this.setGameData();
    this.buttonMovePiece();
  }

  // 设置游戏信息
  setGameData() {
    this.drawNextShape();

    $("#score").text(this.score);
    $("#highest-score").text(this.highScore);
    $("#level").text(this.level);
  }

  // 生成方块
  generatePiece(shape) {
    const { [shape]: s } = this
    return s.shapeTable[s.shapeType[s.type]][s.rotation];
  }

  // 添加方块
  addShape() {
    this.shape = this.nextShape;
    this.previewShape = { ...this.shape };
    this.nextShape = new Shape();

    this.drawGame();
    this.drawNextShape();

    const piece = this.generatePiece("shape"),
      { xOffset, yOffset } = this.shape

    for (let i = 0; i < piece.length; i++) {
      const x = piece[i][1] + xOffset,
        y = piece[i][0] + yOffset;

      if (y >= yOffset && this.map[y + Math.abs(yOffset)][x]) {
        if (this.dropTimer) {
          clearInterval(this.dropTimer);
          this.dropTimer = null;
        }

        this.gameOver = true;
        this.gamePlay = false;
        this.map = null;
        this.shape = null;
        this.nextShape = null;
        this.previewShape = null;
        this.overGame();
        break;
      }
    }
  }

  // 下坠
  dropShape() {
    if (this.gamePaused || !this.dropTimer) return;
    while (this.moveShape(0, 1)) { }
    this.fallToLand();
  }

  // 左移
  moveLeft() {
    this.moveShape(-1, 0);
  }

  // 右移
  moveRight() {
    this.moveShape(1, 0);
  }

  // 下移
  moveDown(enable) {
    if (
      this.gameOver ||
      this.fastForward === enable ||
      (enable && !this.moveShape(0, 1))
    )
      return;
    this.fastForward = enable;
    this.setDropTimer();
  }

  // 开始游戏
  startGame() {
    if (!this.dropTimer) this.addShape()

    if (this.gamePlay) this.setDropTimer()

    if (!this.gamePlay && this.dropTimer) clearInterval(this.dropTimer)
  }

  // 重新开始
  restartGame() {
    if (this.dropTimer) clearInterval(this.dropTimer);

    this.map = [...new Array(this.mapHeight)].map(() =>
      new Array(this.mapWidth).fill(0)
    );

    this.gamePlay = false;
    this.gameOver = false;

    this.shape = null;
    this.nextShape = new Shape();
    this.previewShape = null;

    this.dropTimer = null;
    this.fastForward = false;

    this.score = 0;
    this.level = 1;

    this.clearArea(this.mapCtx)
    this.drawNextShape()
    utils.changeIcon("start-btn", this.gamePlay)
  }

  // 方块旋转
  rotateShape() {
    if (!this.gamePlay || this.gameOver || !this.dropTimer) return;

    const tempRotation = this.shape.rotation;

    this.shape.rotation += 1;

    const currentRotation =
      this.shape.rotation %
      this.shape.shapeTable[this.shape.shapeType[this.shape.type]].length;

    this.shape.rotation = currentRotation;
    this.previewShape.rotation = currentRotation;

    const piece = this.generatePiece("shape");

    for (let i = 0; i < piece.length; i++) {
      const x = piece[i][1] + this.shape.xOffset,
        y = piece[i][0] + this.shape.yOffset;

      if (
        y >= 0 &&
        (this.map[y] === undefined ||
          this.map[y][x] === undefined ||
          this.map[y][x] > 0)
      ) {
        this.shape.rotation = tempRotation;
        this.previewShape.rotation = tempRotation;
      }
    }

    this.drawGame();
  }

  // 移动方块
  moveShape(xStep, yStep) {
    if (!this.gamePlay || this.gameOver || !this.dropTimer) return;

    const width = this.map[0].length,
      height = this.map.length,
      piece = this.generatePiece("shape");

    let canMove = true;

    for (let i = 0; i < piece.length; i++) {
      const x = piece[i][1] + this.shape.xOffset + xStep,
        y = piece[i][0] + this.shape.yOffset + yStep;

      if (
        x < 0 ||
        x >= width ||
        y >= height ||
        (this.map[y] && this.map[y][x])
      ) {
        canMove = false;
        return canMove;
      }
    }

    if (canMove) {
      this.shape.xOffset += xStep;
      this.shape.yOffset += yStep;
      this.previewShape.xOffset += xStep;
      this.drawGame();
    }

    return canMove;
  }

  // 设置下落时间
  setDropTimer() {
    if (!this.gamePlay) return;

    let timestep = Math.round(80 + 800 * Math.pow(0.75, this.level - 1));

    this.fastForward ? timestep = 80 : Math.max(10, timestep);

    if (this.dropTimer) {
      clearInterval(this.dropTimer);
      this.dropTimer = null;
    }

    this.dropTimer = setInterval(() => {
      this.fallToLand();
    }, timestep);
  }

  // 下落至触底
  fallToLand() {
    if (this.moveShape(0, 1)) return;
    this.landShape();
  }

  // 方块触底
  landShape() {
    this.mergeShape();

    const filledRows = this.getFilledRows();

    if (filledRows.length) {
      this.clearFilledRows(filledRows);
      return;
    }

    this.addShape();
  }

  // 合并方块到地图
  mergeShape() {
    const piece = this.generatePiece("shape");

    for (let i = 0; i < piece.length; i++) {
      const x = piece[i][1] + this.shape.xOffset,
        y = piece[i][0] + this.shape.yOffset;

      if (y >= 0) this.map[y][x] = this.shape.type + 1;
    }
  }

  // 获取满行
  getFilledRows() {
    let filledRows = [];

    for (let i = 0; i < this.map.length; i++) {
      if (this.map[i].every((item) => !!item)) filledRows.push(i)
    }

    return filledRows;
  }

  // 消除满行
  clearFilledRows(filledRows) {
    let animationFrame = null,
      progress = 0;

    const numCols = this.map[0].length,
      blockSize = this.blockSize;

    if (this.dropTimer) {
      clearInterval(this.dropTimer);
      this.dropTimer = null;
    }

    const animate = () => {
      // 动画结束
      if (progress === numCols) {
        // 停止动画
        cancelAnimationFrame(animationFrame);

        // 删除行
        filledRows.forEach((row) => {
          this.map.splice(row, 1);
          this.map.unshift(new Array(10).fill(0));
        });

        // 更新分数、等级、新方块和重新启动下落计时器
        this.updateScore(filledRows.length);
        this.updateLevel();
        this.addShape();
        this.setDropTimer();

        // 播放音效
        this.music.playAudio(0.19, 0.7);

        return;
      }

      // 绘制一列小方块
      this.mapCtx.fillStyle = this.clearLineColor;

      const x = progress * blockSize,
        yArray = filledRows.map((row) => row * blockSize);

      yArray.forEach((y) => {
        this.mapCtx.fillRect(x, y, blockSize, blockSize);
      });

      progress += 0.5;

      // 请求下一帧绘制
      animationFrame = requestAnimationFrame(animate);
    };

    // 开始动画
    animate();
  }

  // 更新分数
  updateScore(filledRows) {
    this.score += (filledRows * this.level + (filledRows - 1)) * 10;
    $("#score").text(this.score);

    if (this.gameMode === "double") {
      socket.emit("updateScore", {
        room: sessionStorage.getItem("room"),
        score: this.score,
      });
    }
  }

  // 更新最高分数
  updateHighScore() {
    if (this.score > this.highScore) {
      localStorage.setItem("highScore", this.score);
    }
  }

  // 更新等级
  updateLevel() {
    const nextLevelScore = (this.level + 1) * 100 * this.level;

    if (this.score >= nextLevelScore) {
      this.level += 1;
      this.updateLevel();
      $("#level").text(this.level);
    }
  }

  // 绘制地图
  drawGame() {
    if (!this.shape) return;

    const { map, mapCtx, shape, previewShape, previewShapeColor } = this,
      { type: shapeType, xOffset: shapeXOffset, yOffset: shapeYOffset } = shape,
      { type: previewShapeType, xOffset: previewShapeXOffset, yOffset: previewShapeYOffset } = previewShape,
      piece = this.generatePiece("shape"),
      previewPiece = this.generatePiece("previewShape"),
      finalYOffset = findPreviewOffset(previewShapeYOffset);

    this.clearArea(mapCtx);
    this.drawMap();
    this.drawPiece(mapCtx, previewPiece, previewShapeType, previewShapeXOffset, finalYOffset, previewShapeColor);
    this.drawPiece(mapCtx, piece, shapeType, shapeXOffset, shapeYOffset);

    function findPreviewOffset(offset) {
      for (let i = 0; i < previewPiece.length; i++) {
        const x = previewPiece[i][1] + previewShapeXOffset,
          y = previewPiece[i][0] + offset;

        if (offset >= shapeYOffset && (y > map.length - 2 || (map[y] && map[y + 1][x]))) {
          return offset;
        }
      }

      return findPreviewOffset(offset + 1);
    };
  }

  // 绘制下一个形状
  drawNextShape() {
    const previewCtx = this.nextShapeCtx,
      type = this.nextShape.type,
      piece = this.generatePiece("nextShape");

    this.clearArea(previewCtx)
    this.drawPiece(previewCtx, piece, type, 0, 0);
  }

  // 清除画布区域
  clearArea(ctx) {
    const width = ctx.canvas.width,
      height = ctx.canvas.height;

    ctx.clearRect(0, 0, width, height);
  }

  // 绘制画布区域
  drawMap() {
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        if (!this.map[i][j]) continue;
        this.mapCtx.fillStyle = this.shapeColor[this.map[i][j] - 1];
        this.drawBlock(this.mapCtx, j, i);
      }
    }
  }

  // 绘制形状
  drawPiece(ctx, piece, shapeType, xOffset, yOffset, previewShapeColor) {
    ctx.fillStyle = previewShapeColor || this.shapeColor[shapeType];

    for (let i = 0; i < piece.length; i++) {
      const x = piece[i][1] + xOffset,
        y = piece[i][0] + yOffset;

      if (ctx.canvas.id === "map-canvas") {
        this.drawBlock(ctx, x, y);
      } else {
        switch (shapeType) {
          case 0:
            this.drawBlock(ctx, x, y);
            break;
          case 1:
            this.drawBlock(ctx, x, y, 0, 10);
            break;
          default:
            this.drawBlock(ctx, x, y, 10, 0);
            break;
        }
      }
    }
  }

  // 绘制方块
  drawBlock(ctx, x, y, xOffset = 0, yOffset = 0) {
    ctx.fillRect(
      x * this.blockSize + xOffset,
      y * this.blockSize + yOffset,
      this.blockSize,
      this.blockSize
    );
  }

  // 设置游戏颜色主题
  setGamePalette() {
    const flavor = sessionStorage.getItem("flavor"),
      { previewShapeColor, shapeColor, } = options.palette[flavor];

    this.previewShapeColor = previewShapeColor;
    this.shapeColor = shapeColor;
    this.drawNextShape();
    this.drawGame();
  }

  // 结束游戏
  // XXX: again按钮和quit按钮的功能
  overGame() {
    const separatorElement = $(`
      <div id="sparator" class="absolute top-0 left-0 w-full h-full bg-crust bg-opacity-95"></div>
    `);
    const gameOverInfoTemplate = $(`
      <div id="game-over-info"
        class="z-10 flex flex-col justify-around items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 p-6 border-2 border-text rounded bg-surface0">
        <div id="game-over-title" class="text-4xl font-[Dubtronic]"></div>
        <div id="score-container" class="my-6 text-xs">
          <div>
            <label>YOUR SCORE:</label>
            <span id="your-score-info">${this.score}</span>
          </div>
          <div>
            <label id="another-score-label"></label>
            <span id="another-score-info"></span>
          </div>
          <div>
            <label id="again-label"></label>
            <span id="again-info"></span>
          </div>
        </div>
        <div class="text-xs font-semibold">
          <button id="again-btn" class="w-20 py-1 border-2 border-text rounded" type="button">
            AGAIN
          </button>
          <button id="quit-btn" class="w-20 py-1 border-2 border-text rounded" type="button">
            QUIT
          </button>
        </div>
      </div>
    `).hide();
    $("body").append(separatorElement).append(gameOverInfoTemplate);

    gameOverInfoTemplate.fadeIn("slow");

    if (this.gameMode === "double") {
      socket.emit("gameOver", {
        room: sessionStorage.getItem("room"),
        gameOver: 1,
      });
    } else {
      this.updateHighScore();
      $("#game-over-title").text("GAME OVER");
      $("#another-score-label").text("HIGHEST SCORE:");
      $("#another-score-info").text(this.highScore);

      $("#again-btn").on("touchstart", (e) => {
        e.preventDefault();
        $("#game-over-info").remove()
        $("#sparator").remove()
        this.restartGame()
      });
    }

    $("#quit-btn").on("touchstart", (e) => {
      e.preventDefault();
      location.href = "../index.html";
    });
  }

  // 按钮操作
  buttonMovePiece() {
    // 打开菜单
    $("#menu-btn").on("touchstart", (e) => {
      e.preventDefault();

      const separatorElement = $(`
        <div class="fixed top-0 left-0 w-full h-full bg-crust bg-opacity-95"></div>
      `).hide();
      const menuTemplate = $(`
        <aside class="fixed top-0 right-0 w-2/3 h-full p-3 bg-surface0 animate__animated animate__fadeInRight">
          <header class="flex justify-between items-center">
            <h2 class="text-lg font-semibold">OPTIONS</h2>
            <button id="close-btn" class="flex justify-center items-center">
              <span class="material-icons-round text-2xl leading-3">close</span>
            </button>
          </header>
          <div class="mt-3">
            <!-- 配色 -->
            <div class="flex justify-start items-center">
              <span class="material-icons-round mr-2 text-xl">color_lens</span>
              <span class="font-semibold">Paltte</span>
            </div>
            <ul>
              <li class="menu-item flex justify-start items-center ml-6">
                <span class="material-icons-round mr-2 text-xs text-surface0">star_rate</span>
                <button class="flavor-btn flex justify-start items-center w-full text-sm">Latte</button>
              </li>
              <li class="menu-item flex justify-start items-center ml-6">
                <span class="material-icons-round mr-2 text-xs text-surface0">star_rate</span>
                <button class="flavor-btn flex justify-start items-center w-full text-sm">Frappe</button>
              </li>
              <li class="menu-item flex justify-start items-center ml-6">
                <span class="material-icons-round mr-2 text-xs text-surface0">star_rate</span>
                <button class="flavor-btn flex justify-start items-center w-full text-sm">Macchiato</button>
              </li>
              <li class="menu-item flex justify-start items-center ml-6 text-green">
                <span class="material-icons-round mr-2 text-xs">star_rate</span>
                <button class="flavor-btn flex justify-start items-center w-full text-sm">Mocha</button>
              </li>
            </ul>
          </div>
        </aside>
      `);
      $("body").append(separatorElement).append(menuTemplate);

      separatorElement.fadeIn("fast");

      utils.highlightCurrentOption(".menu-item", "flavor");

      // 关闭菜单
      $("#close-btn").on("touchstart", (e) => {
        e.preventDefault();
        menuTemplate
          .removeClass("animate__fadeInRight")
          .addClass("animate__fadeOutRight")
          .on("animationend", () => {
            separatorElement.fadeOut("fast", () => {
              separatorElement.remove();
            });
            menuTemplate.remove();
          });
      });

      $(".flavor-btn").on("touchstart", (e) => {
        e.preventDefault();
        const flavor = e.currentTarget.innerText.toLowerCase();
        sessionStorage.setItem("flavor", flavor);

        utils.setPagePaltte();
        this.setGamePalette();
        utils.highlightCurrentOption(".menu-item", "flavor");
      });
    });

    // 下落键
    $("#drop-btn").on("touchstart", (e) => {
      e.preventDefault();
      this.dropShape();
    });

    // 左键
    $("#left-btn").on("touchstart", (e) => {
      e.preventDefault();
      this.moveLeft();
    });

    // 右键
    $("#right-btn").on("touchstart", (e) => {
      e.preventDefault();
      this.moveRight();
    });

    // 按下下键
    $("#down-btn").on("touchstart", (e) => {
      e.preventDefault();
      this.moveDown(true);
    });

    // 松开下键
    $("#down-btn").on("touchend", (e) => {
      e.preventDefault();
      this.moveDown(false);
    });

    // 开始和暂停按
    $("#start-btn").on("touchstart", (e) => {
      e.preventDefault();

      this.gamePlay = !this.gamePlay;
      this.startGame()
      utils.changeIcon("start-btn", this.gamePlay)

      this.music.playAudio(0, 0.19);
    });

    // 声音按钮
    $("#volume-btn").on("touchstart", (e) => {
      e.preventDefault();

      this.volumeUp = !this.volumeUp;
      this.music.toggleMute(this.volumeUp);
      utils.changeIcon("volume-btn", this.volumeUp);

      this.music.playAudio(0, 0.19);
    });

    // 重新开始
    $("#restart-btn").on("touchstart", (e) => {
      e.preventDefault();
      this.restartGame()

      this.music.playAudio(0, 0.19);
    });

    // 旋转键
    $("#rotate-btn").on("touchstart", (e) => {
      e.preventDefault();
      this.rotateShape();
    });

    // 将按钮颜色改为激活状态
    $(".o-btn").on("touchstart", (e) => {
      e.preventDefault();
      this.music.playAudio(0, 0.19);
      utils.changeButtonColor(e.currentTarget, "bg-surface2");
    });

    // 将按钮颜色改为背景色
    $(".o-btn").on("touchend", (e) => {
      e.preventDefault();
      utils.changeButtonColor(e.currentTarget, "bg-mantle");
    });
  }
}

module.exports = Game;
