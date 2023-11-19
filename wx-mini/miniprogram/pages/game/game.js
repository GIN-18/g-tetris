const Shape = require("../../static/js/Shape.js")

// pages/game/game.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "TETRIS",

    blockSize: 20,

    map: [...new Array(20)].map(() => new Array(10).fill(0)),

    mapCtx: null,
    mapWidth: 0,
    mapHeight: 0,

    nextCtx: null,
    nextwidth: 0,
    nextHeight: 0,

    gameStart: false,
    gamePaused: false,
    gameOver: false,

    volumeUp: true,

    shape: null,
    nextShape: new Shape(),
    shapeColor: [
      '#f5e0dc',
      '#f5c2e7',
      '#f38ba8',
      '#fab387',
      '#a6e3a1',
      '#89dceb',
      '#89b4fa',
    ],

    dropTimer: null,

    score: 0,
    highScore: 0,
    level: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.initCanvas("#map", "mapCtx", "mapWidth", "mapHeight")
    this.initCanvas("#next", "nextCtx", "nextwidth", "nextHeight").then(() => {
      this.drawNextShape()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 生成下一个方块
  generateNextPiece() {
    const { nextShape: s } = this.data
    return s.shapeTable[s.shapeType[s.type]][s.rotation]
  },

  // 绘制下一个方块
  drawNextShape() {
    const { blockSize: bs, nextShape: ns, shapeColor: sc, nextCtx: ctx, nextWidth: w, nextHeight: h } = this.data
    const p = this.generateNextPiece()
    const t = ns.type

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = sc[ns.type]

    for (let i = 0; i < p.length; i++) {
      const x = p[i][1] * bs
      const y = p[i][0] * bs

      switch (t) {
        case 0:
          ctx.fillRect(x, y, bs, bs)
          break
        case 1:
          ctx.fillRect(x, y + bs / 2, bs, bs)
          break
        default:
          ctx.fillRect(x + bs / 2, y, bs, bs)
          break
      }
    }
  },

  // 初始化画布
  initCanvas(id, content, width, height) {
    return new Promise((resolve, reject) => {
      wx.createSelectorQuery()
        .select(id) // 在 WXML 中填入的 id
        .fields({ node: true, size: true })
        .exec((res) => {
          // Canvas 对象
          const canvas = res[0].node
          // 渲染上下文
          const ctx = canvas.getContext('2d')

          // 初始化画布大小
          const dpr = wx.getWindowInfo().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)

          this.setData({
            [content]: ctx,
            [width]: res[0].width,
            [height]: res[0].height
          })

          resolve()
        })
    })
  },
})