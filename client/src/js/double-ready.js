import "../../dist/style.css";
import "material-icons/iconfont/material-icons.css";

const utils = require("./utils.js");

import latteLogoImage from "../static/logo/logo-latte.webp";
import frappeLogoImage from "../static/logo/logo-frappe.webp";
import macchiatoLogoImage from "../static/logo/logo-macchiato.webp";
import mochaLogoImage from "../static/logo/logo-mocha.webp";

utils.setImage("logo-image", mochaLogoImage);

const {io} = require("socket.io-client");

const socket = io();

document.getElementById("player1").addEventListener("click", () => {
  console.log("player1");
  socket.emit("readyUpdate", true);
})

document.getElementById("player2").addEventListener("click", () => {
  console.log("player2");
  socket.emit("readyUpdate", true);
})
