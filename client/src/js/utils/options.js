// 引入logo图片
const latteLogoImage = require("../../static/logo/logo-latte.webp")
const frappeLogoImage = require("../../static/logo/logo-frappe.webp")
const macchiatoLogoImage = require("../../static/logo/logo-macchiato.webp")
const mochaLogoImage = require("../../static/logo/logo-mocha.webp")

// 引入游戏结束图片
const latteGameOverImage = require("../../static/game-over/game-over-latte.webp")
const frappeGameOverImage = require("../../static/game-over/game-over-frappe.webp")
const macchiatoGameOverImage = require("../../static/game-over/game-over-macchiato.webp")
const mochaGameOverImage = require("../../static/game-over/game-over-mocha.webp")

// 引入游戏胜利图片
const latteGameWinImage = require("../../static/game-over/win-latte.webp")
const frappeGameWinImage = require("../../static/game-over/win-frappe.webp")
const macchiatoGameWinImage = require("../../static/game-over/win-macchiato.webp")
const mochaGameWinImage = require("../../static/game-over/win-mocha.webp")

// 引入游戏失败图片
const latteGameFailImage = require("../../static/game-over/fail-latte.webp")
const frappeGameFailImage = require("../../static/game-over/fail-frappe.webp")
const macchiatoGameFailImage = require("../../static/game-over/fail-macchiato.webp")
const mochaGameFailImage = require("../../static/game-over/fail-mocha.webp")

module.exports = {
  palette: {
    latte: {
      mapBackgroundColor: "#eff1f5",
      previewBackgroundColor: "#ccd0da",
      shapeColor: [
        '#dc8a78',
        '#ea76cb',
        '#d20f39',
        '#fe640b',
        '#40a02b',
        '#04a5e5',
        '#1e66f5',
        '#7287fd',
      ],
      logoImage: latteLogoImage,
      gameOverImage: latteGameOverImage,
      winImage: latteGameWinImage,
      failImage: latteGameFailImage,
    },
    frappe: {
      mapBackgroundColor: "#303446",
      previewBackgroundColor: "#414559",
      shapeColor: [
        '#f2d5cf',
        '#f4b8e4',
        '#e78284',
        '#ef9f76',
        '#a6d189',
        '#99d1db',
        '#8caaee',
        '#babbf1',
      ],
      logoImage: frappeLogoImage,
      gameOverImage: frappeGameOverImage,
      winImage: frappeGameWinImage,
      failImage: frappeGameFailImage,
    },
    macchiato: {
      mapBackgroundColor: "#24273a",
      previewBackgroundColor: "#363a4f",
      shapeColor: [
        '#f4dbd6',
        '#f5bde6',
        '#ed8796',
        '#f5a97f',
        '#a6da95',
        '#91d7e3',
        '#8aadf4',
        '#b7bdf8',
      ],
      logoImage: macchiatoLogoImage,
      gameOverImage: macchiatoGameOverImage,
      winImage: macchiatoGameWinImage,
      failImage: macchiatoGameFailImage,
    },
    mocha: {
      mapBackgroundColor: "#1e1e2e",
      previewBackgroundColor: "#313244",
      shapeColor: [
        '#f5e0dc',
        '#f5c2e7',
        '#f38ba8',
        '#fab387',
        '#a6e3a1',
        '#89dceb',
        '#89b4fa',
        '#b4befe',
      ],
      logoImage: mochaLogoImage,
      gameOverImage: mochaGameOverImage,
      winImage: mochaGameWinImage,
      failImage: mochaGameFailImage,
    }
  }
}
