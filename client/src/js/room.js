import 'animate.css'
import "../../dist/style.css";
import "material-icons/iconfont/material-icons.css";

const _ = require("lodash");
const utils = require("./utils.js");
const socket = require("./socket.js");

import latteLogoImage from "../static/logo/logo-latte.webp";
import frappeLogoImage from "../static/logo/logo-frappe.webp";
import macchiatoLogoImage from "../static/logo/logo-macchiato.webp";
import mochaLogoImage from "../static/logo/logo-mocha.webp";

utils.setImage("logo-image", mochaLogoImage);

// 清除属性
sessionStorage.removeItem("room")
sessionStorage.removeItem('ready')

document.getElementById('create-room').addEventListener('touchstart', () => {
  location.href = "./ready.html";
})

document.getElementById('join-room').addEventListener('touchstart', () => {

})

document.getElementById('join-room').addEventListener('touchstart', () => {
  const roomContainer = document.getElementById("room-container");

  const inputRoomTemplate = `
    <div class="absolute top-0 left-0 w-screen h-screen bg-crust bg-opacity-95"></div>
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
  `
  const inputRoomContainer = document.createElement('div')

  inputRoomContainer.innerHTML = inputRoomTemplate

  roomContainer.appendChild(inputRoomContainer)

  const inputRoom = document.getElementById('input-room')

  // 加入房间
  document.getElementById('join-btn').addEventListener('touchstart', _.debounce(() => {
    const room = inputRoom.value

    if (!room) {
      utils.showMessage("Pleace input room id!", 'error', 2000)
      return
    }

    socket.emit('joinRoom', { room, ready: 0, score: 0, gameOver: 0, action: 0 })

    socket.on('roomJoined', (players) => {
      Object.keys(players).forEach(key => {
        if (key === socket.id) {
          sessionStorage.setItem('room', players[key].room)
          sessionStorage.setItem('ready', players[key].ready)
          sessionStorage.setItem('gameOver', players[key].gameOver)
          // roomContainer.removeChild(inputRoomContainer)

          location.href = './ready.html'
        }
      })
    })

    socket.on('roomFull', () => {
      utils.showMessage("Room is full!", 'error', 2000)
    })

  }, 2000, { leading: true }))

  // 取消加入房间
  document.getElementById('cancel-btn').addEventListener('touchstart', () => {
    inputRoom.value = ''
    roomContainer.removeChild(inputRoomContainer)
  })
})