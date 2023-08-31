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

  // 请求音频
  fetchAudio(volumeUp, audioUrl, start, end) {
    if (!volumeUp) return

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

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
