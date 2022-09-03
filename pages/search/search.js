import { request } from "../../request/index.js"

Page({
  data: {
    // 搜索到的商品数组
    searchedGoodsList: [],
    // 取消按钮是否显示
    isFocus: false,
    // 输入框的值
    iptValue: ''
  },

  // 定时器唯一标识
  timer: null,

  // 根据参数字符串发送请求获取搜索到的商品数据
  async qsearch(query) {
    const res = await request({
      url: "/goods/qsearch",
      data: {
        query,
      },
    })
    this.setData({
      searchedGoodsList: this.data.isFocus ? res : [],
    })
  },

  // 输入框的值发生改变就会触发的事件
  handleInput(e) {
    // 获取输入框的值
    const query = e.detail.value
    // 合法性校验
    if (!query.trim()) {
      this.setData({
        searchedGoodsList: [],
        isFocus: false,
      })
      return
    }
    this.setData({
      isFocus: true,
    })
    // 清除定时器
    if (this.timer) {
      clearTimeout(this.timer)
    }
    // 发送请求获取商品数据
    this.timer = setTimeout(() => {
      this.qsearch(query)
    }, 1000)
  },

  // 点击取消按钮触发的事件
  handleCancel() {
    this.setData({
      searchedGoodsList: [],
      isFocus: false,
      iptValue: ''
    })
  }
})
