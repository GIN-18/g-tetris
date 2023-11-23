// components/index-select/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    url: {
      type: String,
    },
    src: {
      type: String,
    },
    content: {
      type: String,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    redirect() {
      wx.navigateTo({
        url: this.properties.url,
      })
    }
  }
})