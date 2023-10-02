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

    messageBox.classList.add('mb-2', 'px-2', 'py-1', 'border', 'rounded', 'text-xs', 'bg-mantle')

    if (status === 'error') {
      messageBox.classList.add('border-red', 'text-red')
    } else {
      messageBox.classList.add('border-green', 'text-green')
    }

    messageBox.innerText = infoText;

    messageContainer.appendChild(messageBox)

    setTimeout(() => {
      messageContainer.removeChild(messageBox)
    }, delay);
  },
};
