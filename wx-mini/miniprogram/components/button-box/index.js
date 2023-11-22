Component({

  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    active: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeActive() {
      this.setData({
        active: true,
      })
    },
    recoverActive() {
      this.setData({
        active: false,
      })
    }
  }
})