const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

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

  // 更改按钮背景颜色
  changeButtonColor(element, color) {
    const oldColor = element.classList[element.classList.length - 1];

    element.classList.replace(oldColor, color);
  },

  // 显示信息
  showMessage(infoText, delay) {
    const messageContainer = document.getElementById('message');

    const messageBox = document.createElement('span');

    messageBox.classList.add('px-2', 'py-1', 'border', 'border-green', 'rounded', 'text-xs', 'text-green')

    messageBox.innerText = infoText;

    messageContainer.appendChild(messageBox)

    setTimeout(() => {
      messageContainer.removeChild(messageBox)
    }, delay)
  },

  // 请求音频
  fetchAudio(volumeUp, audioUrl, start, end) {
    if (!volumeUp) return

    fetch(audioUrl)
      .then(response => response.arrayBuffer()).then(buffer =>
        audioCtx.decodeAudioData(buffer, (audioBuffer) => {

          const source = audioCtx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioCtx.destination);

          source.start(0, start, end);
        })
      );
  }
};
