class Music {
  constructor(audioUrl) {
    this.audioUrl = audioUrl;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  fetchMusic(volumeUp, start, end) {
    if (!volumeUp) return

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
}

module.exports = Music;