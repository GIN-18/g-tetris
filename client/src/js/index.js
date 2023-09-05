import "../../dist/style.css";
import "material-icons/iconfont/material-icons.css";

const utils = require("./utils.js");

import latteLogoImage from "../static/logo/logo-latte.webp";
import frappeLogoImage from "../static/logo/logo-frappe.webp";
import macchiatoLogoImage from "../static/logo/logo-macchiato.webp";
import mochaLogoImage from "../static/logo/logo-mocha.webp";

utils.setImage("logo-image", mochaLogoImage);

document.querySelectorAll(".select-btn").forEach(element => {
  element.addEventListener("touchstart", (e) => {
    const gameMode = e.currentTarget.getAttribute("data-mode");
    sessionStorage.setItem("gameMode", gameMode);

    if (gameMode === "single") {
      location.replace("game.html")
    } else {
      location.replace("room.html")
    }
  });
});