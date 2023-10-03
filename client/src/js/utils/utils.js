const options = require('./options.js');

module.exports = {
  // 更改图标
  changeIcon(elementId, status, trueIcon, falseIcon) {
    const parentElement = document.getElementById(elementId);
    if (status) {
      parentElement.innerHTML = trueIcon;
    } else {
      parentElement.innerHTML = falseIcon;
    }
  },

  // 设置图片
  setImage(elementId, imageSrc) {
    const img = document.getElementById(elementId);
    img.src = imageSrc;
  },

  // 添加类名元素
  setClassName(operation, newClassName, oldClassName, ...args) {
    args.forEach(element => {
      if (operation === 'replace') {
        document.getElementById(element).classList.replace(newClassName, oldClassName);
      } else if (operation === 'add') {
        document.getElementById(element).classList.add(newClassName);
      } else if (operation === 'remove') {
        document.getElementById(element).classList.remove(oldClassName);
      }
    });
  },

  // 更改按钮背景颜色
  changeButtonColor(element, color) {
    const oldColor = element.classList[element.classList.length - 1];

    element.classList.replace(oldColor, color);
  },

  // 显示信息
  // XXX 动画
  showMessage(infoText, status, delay) {
    const messageContainer = document.getElementById('message');

    const messageBox = document.createElement('div');

    messageBox.classList.add('mb-2', 'px-2', 'py-1', 'border', 'rounded', 'text-xs', 'bg-mantle', 'animate__animated', 'animate__bounce', 'animate__fadeInRight')

    if (status === 'error') {
      messageBox.classList.add('border-red', 'text-red')
    } else {
      messageBox.classList.add('border-green', 'text-green')
    }

    messageBox.innerText = infoText;

    messageContainer.appendChild(messageBox)

    setTimeout(() => {
      messageBox.classList.remove('animate__fadeInRight')
      messageBox.classList.add('animate__fadeOutRight')

      messageBox.addEventListener('animationend', () => {
        messageContainer.removeChild(messageBox)
      })
    }, delay);
  },

  // 高亮当前的选项
  highlightCurrentOption(menuGroup, option) {
    const optionGroup = sessionStorage.getItem(option)

    document.querySelectorAll(menuGroup).forEach(item => {
      item.classList.remove("text-green");
      item.firstElementChild.classList.add("!text-surface0");

      const itemInnerText = item.lastElementChild.innerText.toLowerCase();

      if (itemInnerText === optionGroup) {
        item.firstElementChild.classList.remove("!text-surface0");
        item.classList.add("text-green");
      }
    })
  },

  // 设置颜色主题
  setPagePaltte() {
    const bodyElement = document.body;
    const oldFlavor = bodyElement.classList[0];

    if (!sessionStorage.getItem("flavor")) {
      sessionStorage.setItem('flavor', oldFlavor)
    }

    const flavor = sessionStorage.getItem('flavor');

    const logoImage = options.palette[flavor].logoImage;

    bodyElement.classList.replace(oldFlavor, flavor);

    this.setImage("logo-image", logoImage);
  },
};
