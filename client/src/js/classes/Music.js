const audioUrl = require('../../static/audio/music.mp3');

class Music {
  constructor() {
    this.audioUrl = audioUrl;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = null;
  }

  playAudio(start, end) {
    fetch(this.audioUrl)
      .then(response => response.arrayBuffer())
      .then(buffer => this.audioCtx.decodeAudioData(buffer, audioBuffer => {
        const source = this.audioCtx.createBufferSource();
        source.buffer = audioBuffer;

        // 创建 GainNode 节点
        this.gainNode = this.audioCtx.createGain();
        this.gainNode.connect(this.audioCtx.destination);

        // 音频源连接到 GainNode
        source.connect(this.gainNode);

        source.start(0, start, end);
      }));
  }

  toggleMute(volumeUp) {
    if (volumeUp) {
      // 恢复音量
      this.gainNode.gain.value = 1;
      this.audioCtx.resume();
    } else {
      // 静音
      this.gainNode.gain.value = 0;
      this.audioCtx.suspend();
    }
  }
}

module.exports = Music;