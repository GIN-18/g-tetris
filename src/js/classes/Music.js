class Music {
    constructor(audioUrl) {
        this.audioUrl = audioUrl;
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.audioSource = {}
        this.fetchAudio()
    }

    // 通过fetch获取音频
    fetchAudio() {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        fetch(this.audioUrl).then((response) => {
            return response.arrayBuffer();
        }).then((buffer) => {
            audioCtx.decodeAudioData(buffer, (audioBuffer) => {

                const getSource = () => {
                    const source = audioCtx.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(audioCtx.destination);
                    return source;
                }

                // 清除方块
                this.audioSource.clear = () => {
                    getSource().start(0, 0.2000, 0.6000);
                }

                // 移动方块
                this.audioSource.button = () => {
                    getSource().start(0, 0, 0.2000);
                }
            }
            )
        })
    }
}

module.exports = Music;