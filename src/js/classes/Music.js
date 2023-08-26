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

                // 游戏开始
                this.audioSource.start = () => {
                    getSource().start(0, 3.7202, 3.6224);
                }

                // 方块下落
                this.audioSource.fall = () => {
                    getSource().start(0, 1.2558, 0.3546);
                }

                // 旋转方块
                this.audioSource.rotate = () => {
                    getSource().start(0, 2.2471, 0.0807);
                }

                // 移动方块
                this.audioSource.move = () => {
                    getSource().start(0, 2.9088, 0.1437);
                }
            }
            )
        })
    }
}

module.exports = Music;