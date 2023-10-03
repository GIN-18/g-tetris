const audioUrl = require('../../static/audio/music.mp3');

class Music {
  constructor() {
    this.audioUrl = audioUrl;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  fetchMusic(start, end) {
    fetch(this.audioUrl)
      .then(response => response.arrayBuffer()).then(buffer =>
        this.audioCtx.decodeAudioData(buffer, (audioBuffer) => {

          const source = this.audioCtx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(this.audioCtx.destination);

          source.start(0, start, end);
        })
      );
  }

  toggleMute(volumeUp) {
    if (volumeUp) {
      // 音量上昇
      this.audioCtx.resume();
    } else {
      // 音量下降
      this.audioCtx.suspend();
    }
  }
}

module.exports = Music;