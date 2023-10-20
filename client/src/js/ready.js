import "../css/style.css";
import "animate.css";
import "material-icons/iconfont/material-icons.css";

const $ = require("jquery");
const _ = require("lodash");
const Clipboard = require("clipboard");
const utils = require("./utils/utils.js");
const socket = require("./utils/socket.js");

utils.setPagePaltte();

sessionStorage.setItem("gameMode", "double");

const roomId = $("#room-id");

const player1Id = $("#player1-id");
const player1Status = $("#player1-status");

const player2Id = $("#player2-id");
const player2Status = $("#player2-status");

const statusButton = $("#status-btn");
const countdown = $("#countdown");

let countdownInterval = null;

if (!sessionStorage.getItem("room")) {
  socket.emit("createRoom");
} else {
  socket.emit("joinRoom", {
    action: 1,
    room: sessionStorage.getItem("room"),
    ready: 0,
    page: "ready",
  });
}

socket.on("roomCreated", (players) => {
  const playerId = socket.id;

  countdown.text(5);

  sessionStorage.setItem("room", players[playerId].room);
  sessionStorage.setItem("ready", players[playerId].ready);
  sessionStorage.setItem("page", players[playerId].page);

  if (!players[playerId].ready) {
    player1Status.text("not ready").addClass("text-red");
    statusButton.text("Ready");
  }

  roomId.text(sessionStorage.getItem("room"));

  player1Id.text(playerId);
});

roomId.text(sessionStorage.getItem("room"));

// 刷新时重新加入房间
socket.on("roomJoined", (players) => {
  const playerId = socket.id;

  countdown.text(5);

  _.forEach(players, (value, player) => {
    if (player === playerId) {
      player1Id.text(player.substring(0, 8));

      if (!value.ready) {
        player1Status.text("not ready").addClass("text-red");
        statusButton.text("Ready");
      } else {
        socket.emit("ready", {
          room: sessionStorage.getItem("room"),
          ready: sessionStorage.getItem("ready"),
        });
        player1Status.text("ready").addClass("text-green");
        statusButton.text("Cancel");
      }
    } else {
      player2Id.text(player.substring(0, 8));

      if (!value.ready) {
        player2Status.text("not ready").addClass("text-red");
      } else {
        socket.emit("ready", {
          room: sessionStorage.getItem("room"),
          ready: sessionStorage.getItem("ready"),
        });
        player2Status.text("ready").addClass("text-green");
      }
    }
  });
});

// 玩家加入提醒
socket.on("playerJoined", (players) => {
  const playerId = socket.id;

  _.forEach(players, (value, player) => {
    player2Id.text(player.substring(0, 8));

    if (value.ready && player !== playerId) {
      player2Status.text("ready").addClass("text-green");
    } else if (!value.ready && player !== playerId) {
      player2Status.text("not ready").addClass("text-red");
    }
  });

  socket.emit("ready", {
    room: sessionStorage.getItem("room"),
    ready: sessionStorage.getItem("ready"),
  });
  utils.showMessage("Player 2 joined room!!", "hint", 1500);
});

// 玩家准备
statusButton.on("touchstart", () => {
  const ready = Number(sessionStorage.getItem("ready"));

  if (!ready) {
    sessionStorage.setItem("ready", 1);
    socket.emit("ready", {
      room: sessionStorage.getItem("room"),
      ready: sessionStorage.getItem("ready"),
    });
  } else {
    sessionStorage.setItem("ready", 0);
    socket.emit("ready", {
      room: sessionStorage.getItem("room"),
      ready: sessionStorage.getItem("ready"),
    });
  }
});

socket.on("zeroPlayerReady", (players) => {
  player1Status
    .text("not ready")
    .removeClass("text-green")
    .addClass("text-red");
  statusButton.text("Ready");

  if (_.size(players) > 1) {
    player2Status
      .text("not ready")
      .removeClass("text-green")
      .addClass("text-red");
  }

  setClassNameForCountdown("border-red", "text-red");
});

socket.on("onePlayerReady", (players) => {
  const playerId = socket.id;

  // 玩家1状态
  _.forEach(players, (value, player) => {
    if (value.ready && player === playerId) {
      player1Status
        .text("ready")
        .removeClass("text-red")
        .addClass("text-green");
      statusButton.text("Cancel");
    } else if (!value.ready && player === playerId) {
      player1Status
        .text("not ready")
        .removeClass("text-green")
        .addClass("text-red");
      statusButton.text("Ready");
    }

    // 玩家2状态
    if (value.ready && player !== playerId) {
      player2Status
        .text("ready")
        .removeClass("text-red")
        .addClass("text-green");
    } else if (!value.ready && player !== playerId) {
      player2Status
        .text("not ready")
        .removeClass("text-green")
        .addClass("text-red");
    }
  });

  setClassNameForCountdown("border-yellow", "text-yellow");

  // 清除倒计时
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdown.text(5);
  }
});

socket.on("twoPlayerReady", () => {
  // 玩家1状态
  player1Status.text("ready").removeClass("text-red").addClass("text-green");
  statusButton.text("Cancel");

  // 玩家2状态
  player2Status.text("ready").removeClass("text-red").addClass("text-green");

  setClassNameForCountdown("border-green", "text-green");

  // 倒计时
  readyToCountdown(countdown.text());
});

// 用户离开的处理逻辑
socket.on("playerLeftRoom", () => {
  player2Id.text("");
  player2Status.text("");
  utils.showMessage("Player 2 left room!!", "error", 1500);
});

// 复制房间ID
const clipboard = new Clipboard("#copy-button");

// 复制成功触发
clipboard.on("success", (e) => {
  e.clearSelection();
  utils.showMessage("Copied", "hint", 1500);
});

// 复制失败触发
clipboard.on("error", (e) => {
  utils.showMessage("Copy Error", "error", 1500);
});

// 倒计时
function readyToCountdown(seconds) {
  countdownInterval = setInterval(() => {
    seconds--;
    countdown.text(seconds);

    if (seconds <= 0) {
      clearInterval(countdownInterval);
      location.href = "game.html";
    }
  }, 1000);
}

function setClassNameForCountdown(border, text) {
  const borderRegex = /^border-/,
    textRegex = /^text-/,
    classList = countdown.parent().prop("classList");

  (function match(...args) {
    args.forEach((arg) => {
      const matchedValue = String(
        Object.values(classList).filter((value) => arg.test(value))
      );
      countdown.parent().removeClass(matchedValue);
    });
  })(borderRegex, textRegex);

  countdown.parent().addClass(`${border} ${text}`);
}
