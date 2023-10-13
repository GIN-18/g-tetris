import "../../dist/style.css";
import "animate.css";
import "material-icons/iconfont/material-icons.css";

const _ = require("lodash");
const $ = require("jquery");
const utils = require("./utils/utils.js");
const socket = require("./utils/socket.js");

utils.setPagePaltte();

// 清除sessionStorage
sessionStorage.removeItem("room");
sessionStorage.removeItem("ready");
sessionStorage.removeItem("page");

// 创建房间
$("#create-room").on("touchstart", (e) => {
  e.preventDefault();
  location.href = "./ready.html";
});

$("#join-room").on("touchstart", (e) => {
  e.preventDefault();

  const inputRoomContainer = $("<div></div>").hide();
  const separatorElement = $(`
    <div class="absolute top-0 left-0 w-screen h-screen bg-crust bg-opacity-95"></div>
  `);
  const inputRoomTemplate = `
    <div
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between items-center font-semibold">
      <div id="join-message" class="hidden justify-center items-center text-red"></div>
      <div class="flex flex-col justify-between items-center px-10 py-6 border-2 border-text rounded bg-mantle">
        <span class="text-lg">Join Room</span>
        <input id="input-room"
          class="my-5 px-3 py-2 border border-text rounded outline-none text-sm font-normal bg-base focus:border-0 focus:outline-blue placeholder:text-surface1"
          type="text" placeholder="pleace input room id">
        <div class="flex justify-around items-center w-full">
          <button id="join-btn" class="w-1/3 py-1 rounded text-mantle bg-green" type="button">Join</button>
          <button id="cancel-btn" class="w-1/3 py-1 rounded text-mantle bg-yellow" type="button">Cancel</button>
        </div>
      </div>
    </div>
  `;
  inputRoomContainer.html(inputRoomTemplate);

  $("body").append(separatorElement).append(inputRoomContainer);

  inputRoomContainer.fadeIn();

  // 加入房间
  $("#join-btn").on(
    "touchstart",
    _.debounce(
      (e) => {
        e.preventDefault();
        const room = $("#input-room").val();

        if (!room) {
          utils.showMessage("Pleace input room id!!!", "error", 2000);
          return;
        }

        socket.emit("joinRoom", {
          action: 0,
          room,
          ready: 0,
          score: 0,
          page: "ready",
        });
      },
      2000,
      { leading: true }
    )
  );

  // 取消加入房间
  $("#cancel-btn").on("touchstart", (e) => {
    e.preventDefault();
    $("#input-room").val("");
    inputRoomContainer.fadeOut(() => {
      separatorElement.remove();
      inputRoomContainer.remove();
    });
  });
});

socket.on("roomFull", () => {
  utils.showMessage("Room is full!!!", "error", 2000);
  return;
});

socket.on("roomJoined", (players) => {
  const playerId = socket.id;

  Object.keys(players).forEach((key) => {
    if (key === playerId) {
      sessionStorage.setItem("room", players[key].room);
      sessionStorage.setItem("ready", players[key].ready);
      sessionStorage.setItem("page", players[key].page);

      location.href = "./ready.html";
    }
  });
});
