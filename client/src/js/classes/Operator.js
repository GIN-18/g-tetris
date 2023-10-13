const $ = require("jquery");
const utils = require("../utils/utils.js");

class Operator {
  constructor(game, music) {
    this.game = game;
    this.music = music;

    this.stopIcon = `<span class="material-icons-round !text-sm !leading-3">pause</span>`;
    this.startIcon = `<span class="material-icons-round !text-sm !leading-3">play_arrow</span>`;

    this.volumeOff = `<span class="material-icons-round !text-sm !leading-3">volume_off</span>`;
    this.volumeUp = `<span class="material-icons-round !text-sm !leading-3">volume_up</span>`;
  }

  // 按钮操作
  buttonMovePiece() {
    // 打开菜单
    $("#menu-btn").on("touchstart", (e) => {
      e.preventDefault();

      const menuContainer = $("<div></div>");
      const separatorElement = $(`
        <div class="absolute top-0 left-0 w-screen h-screen bg-crust bg-opacity-95"></div>
      `);
      const menuTemplate = `
        <aside class="absolute top-0 right-0 w-2/3 h-screen p-3 bg-surface0 animate__animated animate__slideInRight">
          <header class="flex justify-between items-center">
            <h2 class="text-lg font-semibold">OPTIONS</h2>
            <button id="close-btn" class="flex justify-center items-center">
              <span class="material-icons-round !text-2xl !leading-3">close</span>
            </button>
          </header>
          <div class="mt-3">
            <!-- 配色 -->
            <div class="flex justify-start items-center">
              <span class="material-icons-round mr-2 !text-xl">color_lens</span>
              <span class="font-semibold">Paltte</span>
            </div>
            <ul>
              <li class="menu-item flex justify-start items-center ml-6">
                <span class="material-icons-round mr-2 !text-xs !text-surface0">star_rate</span>
                <button class="flavor-btn flex justify-start items-center w-full text-sm">Latte</button>
              </li>
              <li class="menu-item flex justify-start items-center ml-6">
                <span class="material-icons-round mr-2 !text-xs !text-surface0">star_rate</span>
                <button class="flavor-btn flex justify-start items-center w-full text-sm">Frappe</button>
              </li>
              <li class="menu-item flex justify-start items-center ml-6">
                <span class="material-icons-round mr-2 !text-xs !text-surface0">star_rate</span>
                <button class="flavor-btn flex justify-start items-center w-full text-sm">Macchiato</button>
              </li>
              <li class="menu-item flex justify-start items-center ml-6 text-green">
                <span class="material-icons-round mr-2 !text-xs">star_rate</span>
                <button class="flavor-btn flex justify-start items-center w-full text-sm">Mocha</button>
              </li>
            </ul>
          </div>
        </aside>
      `;
      menuContainer.html(menuTemplate);

      $("body").append(separatorElement).append(menuContainer);

      utils.highlightCurrentOption(".menu-item", "flavor");

      // 关闭菜单
      $("#close-btn").on("touchstart", (e) => {
        e.preventDefault();
        menuContainer
          .children()
          .removeClass("animate__slideInRight")
          .addClass("animate__slideOutRight")
          .on("animationend", () => {
            separatorElement.remove();
            menuContainer.remove();
          });
      });

      $(".flavor-btn").on("touchstart", (e) => {
        e.preventDefault();
        const flavor = e.currentTarget.innerText.toLowerCase();
        sessionStorage.setItem("flavor", flavor);

        utils.setPagePaltte();
        this.game.setGamePalette();
        utils.highlightCurrentOption(".menu-item", "flavor");
      });
    });

    // 开始和暂停按钮
    $("#start-btn").on("touchstart", (e) => {
      e.preventDefault();

      if (!this.game.gameStart) {
        this.game.gameStart = true;
        utils.changeIcon(
          "start-btn",
          this.game.gameStart,
          this.stopIcon,
          this.startIcon
        );
        this.game.startGame();
        return;
      }

      this.game.gamePaused = !this.game.gamePaused;

      utils.changeIcon(
        "start-btn",
        !this.game.gamePaused,
        this.stopIcon,
        this.startIcon
      );

      this.music.fetchMusic(0, 0.19);

      this.game.setDropTimer();
    });

    // 声音按钮
    $("#volume-btn").on("touchstart", (e) => {
      e.preventDefault();

      this.game.volumeUp = !this.game.volumeUp;
      this.music.toggleMute(this.game.volumeUp);

      utils.changeIcon(
        "volume-btn",
        this.game.volumeUp,
        this.volumeUp,
        this.volumeOff
      );

      this.music.fetchMusic(0, 0.19);
    });

    // 重新开始
    $("#restart-btn").on("touchstart", (e) => {
      e.preventDefault();
      location.reload();
    });

    // 旋转键
    $("#rotate-btn").on("touchstart", (e) => {
      e.preventDefault();
      this.game.rotateShape(1);
    });

    // 下落键
    $("#drop-btn").on("touchstart", (e) => {
      e.preventDefault();
      this.game.dropShape();
    });

    // 左键
    $("#left-btn").on("touchstart", (e) => {
      e.preventDefault();
      this.game.moveLeft();
    });

    // 右键
    $("#right-btn").on("touchstart", (e) => {
      e.preventDefault();
      this.game.moveRight();
    });

    // 按下下键
    $("#down-btn").on("touchstart", (e) => {
      e.preventDefault();
      this.game.moveDown(true);
    });

    // 松开下键
    $("#down-btn").on("touchend", (e) => {
      e.preventDefault();
      this.game.moveDown(false);
    });

    // 将按钮颜色改为激活状态
    $(".o-btn").on("touchstart", (e) => {
      e.preventDefault();
      this.music.fetchMusic(0, 0.19);
      utils.changeButtonColor(e.currentTarget, "bg-surface0");
    });

    // 将按钮颜色改为背景色
    $(".o-btn").on("touchend", (e) => {
      e.preventDefault();
      utils.changeButtonColor(e.currentTarget, "bg-mantle");
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
}

module.exports = Operator;
