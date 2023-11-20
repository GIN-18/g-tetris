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

    mapCanvas: null,
    mapCtx: null,
    mapWidth: 0,
    mapHeight: 0,

    nextCanvas: null,
    nextCtx: null,
    nextwidth: 0,
    nextHeight: 0,

    gamePlay: false,
    gameOver: false,

    volumeUp: true,

    shape: null,
    nextShape: new Shape(),
    clearLineColor: '#b4befe',
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
    this.initCanvas("#map", "mapCanvas", "mapCtx", "mapWidth", "mapHeight")
    this.initCanvas("#next", "nextCanvas", "nextCtx", "nextWidth", "nextHeight").then(() => {
      this.drawNextPiece()
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

  // 生成方块
  generatePiece() {
    const { shape: s } = this.data
    return s.shapeTable[s.shapeType[s.type]][s.rotation]
  },

  // 生成下一个方块
  generateNextPiece() {
    const { nextShape: s } = this.data
    return s.shapeTable[s.shapeType[s.type]][s.rotation]
  },

  // 开始游戏
  startGame() {
    this.addShape()
    this.setDropTimer()
  },

  // 添加形状
  addShape() {
    this.setData({
      shape: this.data.nextShape,
      nextShape: new Shape(),
    })

    this.drawMap()
    this.drawNextPiece()
  },

  // 设置下落间隔
  setDropTimer() {
    const { level, fastForward, dropTimer, gamePlay } = this.data
    let timestep = Math.round(80 + 800 * Math.pow(0.75, level - 1));

    timestep = Math.max(10, timestep);

    if (fastForward) {
      timestep = 80;
    }

    if (dropTimer || gamePlay) {
      clearInterval(dropTimer);

      this.setData({
        dropTimer: null,
      })
    }

    if (!gamePlay) {
      let d;

      d = setInterval(() => {
        this.fallToLand();
      }, timestep);

      this.setData({
        dropTimer: d,
      })
    }
  },

  //下落触底
  fallToLand() {
    if (this.movePiece(0, 1)) return
    this.landPiece()
  },

  // 触底
  landPiece() {
    this.mergePiece()

    const fr = this.getFilledRows()

    if (fr.length) {
      this.clearFilledRows(fr)
    } else {
      this.addShape()
    }
  },

  // 合并方块
  mergePiece() {
    const { map, shape } = this.data
    const { type: t, xOffset: xo, yOffset: yo } = shape
    const p = this.generatePiece();

    for (let i = 0; i < p.length; i++) {
      const x = p[i][1] + xo;
      const y = p[i][0] + yo;

      if (y >= 0) map[y][x] = t + 1;
    }
  },

  // 获取满行
  getFilledRows() {
    const { map } = this.data;

    let filledRows = [];

    for (let i = 0; i < map.length; i++) {
      if (map[i].every((item) => !!item)) {
        filledRows.push(i);
      }
    }

    return filledRows;
  },

  // 清除满行
  clearFilledRows(filledRows) {
    const { map, mapCanvas: mcs, blockSize: bs, mapCtx: ctx, clearLineColor: clc, dropTimer: dt } = this.data

    let animationFrame = null;
    let progress = 0;

    const numCols = map[0].length;

    if (dt) {
      clearInterval(dt);

      this.setData({
        dropTimer: null,
      })
    }

    const animate = () => {

      // 动画结束
      if (progress === numCols) {
        // 停止动画
        mcs.cancelAnimationFrame(animationFrame);

        // 删除行
        filledRows.forEach((row) => {
          map.splice(row, 1);
          map.unshift(new Array(10).fill(0));
        });

        // 更新分数、等级、新方块和重新启动下落计时器
        this.updateScore(filledRows.length);
        this.updateLevel();
        this.addShape();
        this.setDropTimer();

        // 播放音效
        // this.music.playAudio(0.19, 0.7);

        return;
      }

      // 绘制一列小方块
      ctx.fillStyle = clc;

      const x = progress * bs,
        yArray = filledRows.map((row) => row * bs);

      yArray.forEach((y) => {
        ctx.fillRect(x, y, bs, bs);
      });

      progress += 0.5;

      // 请求下一帧绘制
      animationFrame = mcs.requestAnimationFrame(animate);
    };

    // 开始动画
    animate();
  },

  // 更新分数
  updateScore(filledRows) {
    let { score, level } = this.data

    score += (filledRows * level + (filledRows - 1)) * 10;

    this.setData({
      score
    })
  },

  // 更新等级
  updateLevel() {
    let { score, level } = this.data;
    let nextLevelScore = (level + 1) * 100 * level;

    while (score >= nextLevelScore) {
      level += 1;
      nextLevelScore = (level + 1) * 100 * level;
    }

    this.setData({
      level
    })
  },

  // 下坠
  dropPiece() {
    const { gamePlay, dropTimer } = this.data

    // if (gamePlay || !dropTimer) return;

    while (this.movePiece(0, 1)) { }

    this.landPiece()
  },

  // 左移
  moveLeft() {
    this.movePiece(-1, 0);
  },

  // 右移
  moveRight() {
    this.movePiece(1, 0);
  },

  // 下移
  moveDown() {
    this.setData({
      fastForward: true,
    })

    this.setDropTimer()
  },

  // 结束下移
  endDown() {
    this.setData({
      fastForward: false,
    })

    this.setDropTimer()
  },

  // 移动方块
  movePiece(xStep, yStep) {
    const { map, shape, gamePlay, gameOver, dropTimer } = this.data

    // if (!gamePlay || gameOver || !dropTimer) return;

    const w = map[0].length;
    const h = map.length;
    const p = this.generatePiece();

    let canMove = true;
    let xo = shape.xOffset;
    let yo = shape.yOffset;

    for (let i = 0; i < p.length; i++) {
      const x = p[i][1] + xo + xStep;
      const y = p[i][0] + yo + yStep;

      if (x < 0 || x >= w || y >= h || (map[y] && map[y][x])) {
        canMove = false;
        return canMove;
      }
    }

    if (canMove) {
      this.setData({
        "shape.xOffset": xo += xStep,
        "shape.yOffset": yo += yStep,
      })

      this.drawMap();
    }

    return canMove;
  },

  // 旋转方块
  rotatePiece() {
    const { map, shape, gamePlay, gameOver, dropTimer } = this.data

    // if (!gamePlay || gameOver || !dropTimer) return;

    let { rotation } = shape
    const ir = rotation
    const tr = rotation += 1

    const r = tr % shape.shapeTable[shape.shapeType[shape.type]].length

    this.setData({
      "shape.rotation": r,
    })

    const p = this.generatePiece();

    for (let i = 0; i < p.length; i++) {
      const x = shape.xOffset + p[i][1];
      const y = shape.yOffset + p[i][0];

      if (y >= 0 && (map[y] === undefined || map[y][x] === undefined || map[y][x] > 0)) {
        this.setData({
          "shape.rotation": ir,
        })
      }
    }

    this.drawMap();
  },

  // 绘制地图
  drawMap() {
    const { blockSize: bs, map: m, shape: s, shapeColor: sc, mapCtx: ctx, mapWidth: w, mapHeight: h } = this.data
    const { xOffset: xo, yOffset: yo, type: t } = s
    const p = this.generatePiece()

    ctx.clearRect(0, 0, w, h)

    for (let i = 0; i < m.length; i++) {
      for (let j = 0; j < m[i].length; j++) {
        if (!m[i][j]) continue

        const x = j * bs
        const y = i * bs

        ctx.fillStyle = sc[m[i][j] - 1]
        ctx.fillRect(x, y, bs, bs)
      }
    }

    // 绘制方块
    ctx.fillStyle = sc[t]
    for (let i = 0; i < p.length; i++) {
      const x = (p[i][1] + xo) * bs
      const y = (p[i][0] + yo) * bs

      ctx.fillRect(x, y, bs, bs)
    }
  },

  // 绘制下一个方块
  drawNextPiece() {
    const { blockSize: bs, nextShape: ns, shapeColor: sc, nextCtx: ctx, nextWidth: w, nextHeight: h } = this.data
    const p = this.generateNextPiece()
    const t = ns.type

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = sc[t]

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
  initCanvas(id, canvas, content, width, height) {
    return new Promise((resolve, reject) => {
      wx.createSelectorQuery()
        .select(id) // 在 WXML 中填入的 id
        .fields({ node: true, size: true })
        .exec((res) => {
          // Canvas 对象
          const cs = res[0].node
          // 渲染上下文
          const ctx = cs.getContext('2d')

          // 初始化画布大小
          const dpr = wx.getWindowInfo().pixelRatio
          cs.width = res[0].width * dpr
          cs.height = res[0].height * dpr
          ctx.scale(dpr, dpr)

          this.setData({
            [canvas]: cs,
            [content]: ctx,
            [width]: res[0].width,
            [height]: res[0].height
          })

          resolve()
        })
    })
  },
})