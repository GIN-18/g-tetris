import "../../dist/style.css";
import "material-icons/iconfont/material-icons.css";

const utils = require("./utils.js");
const socket = require("./socket.js");

import latteLogoImage from "../static/logo/logo-latte.webp";
import frappeLogoImage from "../static/logo/logo-frappe.webp";
import macchiatoLogoImage from "../static/logo/logo-macchiato.webp";
import mochaLogoImage from "../static/logo/logo-mocha.webp";

utils.setImage("logo-image", mochaLogoImage);

document.getElementById('create-room').addEventListener('touchstart', () => {
  location.href = "./ready.html";
})