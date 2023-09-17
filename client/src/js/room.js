import "../../dist/style.css";
import "material-icons/iconfont/material-icons.css";

const utils = require("./utils.js");
const socket = require("./socket.js");

import latteLogoImage from "../static/logo/logo-latte.webp";
import frappeLogoImage from "../static/logo/logo-frappe.webp";
import macchiatoLogoImage from "../static/logo/logo-macchiato.webp";
import mochaLogoImage from "../static/logo/logo-mocha.webp";

utils.setImage("logo-image", mochaLogoImage);

sessionStorage.removeItem("room")

document.getElementById('create-room').addEventListener('touchstart', () => {
  location.href = "./ready.html";
})

document.getElementById('join-room').addEventListener('touchstart', () => {

})

document.getElementById('join-room').addEventListener('touchstart', () => {
  const roomContainer = document.getElementById("room-container");
  let message = ''

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
          <button id="join-btn" class="w-1/3 py-1 rounded text-mantle bg-green" type="button">join</button>
          <button id="cancel-btn" class="w-1/3 py-1 rounded text-mantle bg-yellow" type="button">cancel</button>
        </div>
      </div>
    </div>
  `
  const inputRoomContainer = document.createElement('div')

  inputRoomContainer.innerHTML = inputRoomTemplate

  roomContainer.appendChild(inputRoomContainer)

  const inputRoom = document.getElementById('input-room')

  // 加入房间
  document.getElementById('join-btn').addEventListener('touchstart', () => {
    const room = inputRoom.value

    if (!room) {
      showMessage("Pleace input room id!")
      return
    }

    socket.emit('joinRoom', room)

    socket.on('roomJoined', (data) => {
      sessionStorage.setItem('room', data)
      roomContainer.removeChild(inputRoomContainer)

      location.href = './ready.html'
    })

    socket.on('roomFull', () => {
      showMessage("Room is full!")
    })

  })

  // 取消加入房间
  document.getElementById('cancel-btn').addEventListener('touchstart', () => {
    inputRoom.value = ''
    roomContainer.removeChild(inputRoomContainer)
  })
})

function showMessage(message) {
  const joinMessage = document.getElementById('join-message')

  const messageTemplate = `
    <span class="material-icons-round mr-1 !text-lg">error_outline</span>
    <span>${message}</span>
  `

  joinMessage.innerHTML = messageTemplate

  joinMessage.classList.replace('hidden', 'flex')

  setTimeout(() => {
    joinMessage.classList.replace('flex', 'hidden')
  }, 2000)
}