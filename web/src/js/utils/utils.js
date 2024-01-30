module.exports = {
  // 更改图标
  changeIcon(elementId, status) {
    const parentElement = document.getElementById(elementId);

    let icon;

    switch (elementId) {
      case "start-btn":
        icon = status ? "pause" : "play_arrow";
        break;
      case "volume-btn":
        icon = status ? "volume_up" : "volume_off";
        break;
    }

    const iconHtml = `<span class="material-icons-round text-sm leading-3">${icon}</span>`;
    parentElement.innerHTML = iconHtml;
  },

  // 更改按钮背景颜色
  changeButtonColor(element, color) {
    const oldColor = element.classList[element.classList.length - 1];

    element.classList.replace(oldColor, color);
  },

  // 显示信息
  showMessage(infoText, status, delay) {
    const messageContainer = document.getElementById("message");
    const messageBox = document.createElement("div");
    messageBox.classList.add(
      "mb-2",
      "px-2",
      "py-1",
      "border",
      "rounded",
      "text-xs",
      "bg-mantle",
      "animate__animated",
      "animate__fadeInRight"
    );
    switch (status) {
      case 'success':
        messageBox.classList.add("border-green", "text-green");
        break;
      case 'error':
        messageBox.classList.add("border-red", "text-red");
        break;
      case 'warn':
        messageBox.classList.add("border-yellow", "text-yellow");
        break;
      case 'hint':
        messageBox.classList.add("border-peach", "text-peach");
        break;
    }
    messageBox.innerText = infoText;
    messageContainer.appendChild(messageBox);
    setTimeout(() => {
      messageBox.classList.remove("animate__fadeInRight");
      messageBox.classList.add("animate__fadeOutRight");

      messageBox.addEventListener("animationend", () => {
        messageContainer.removeChild(messageBox);
      });
    }, delay);
  },

  // 高亮当前的选项
  highlightCurrentOption(menuGroup, option) {
    const optionGroup = sessionStorage.getItem(option);

    document.querySelectorAll(menuGroup).forEach((item) => {
      item.classList.remove("text-green");
      item.firstElementChild.classList.add("text-surface0");

      const itemInnerText = item.lastElementChild.innerText.toLowerCase();

      if (itemInnerText === optionGroup) {
        item.firstElementChild.classList.remove("text-surface0");
        item.classList.add("text-green");
      }
    });
  },

  // 设置颜色主题
  setPagePaltte() {
    const bodyElement = document.body;
    const oldFlavor = bodyElement.classList[0];

    if (!sessionStorage.getItem("flavor")) {
      sessionStorage.setItem("flavor", oldFlavor);
    }

    const flavor = sessionStorage.getItem("flavor");

    bodyElement.classList.replace(oldFlavor, flavor);
  },

  // 阻止页面放大
  preventZoom() {
    document.addEventListener("gesturestart", function (e) {
      e.preventDefault();
      document.body.style.zoom = 1;
    });
    document.addEventListener("gesturechange", function (e) {
      e.preventDefault();

      document.body.style.zoom = 1;
    });
    document.addEventListener("gestureend", function (e) {
      e.preventDefault();
      document.body.style.zoom = 1;
    });
    document.addEventListener("dblclick", function (e) {
      e.preventDefault();
      document.body.style.zoom = 1;
    });
  },
};
