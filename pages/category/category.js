import { request } from "../../request/index.js"

Page({
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 当前被点击的菜单索引
    currentIndex: 0,
    // 右侧内容滚动条距离顶部的距离
    scrollTop: 0,
  },

  // 接口的返回数据
  Cates: [],

  onLoad() {
    // 获取本地存储中的数据
    const Cates = wx.getStorageSync("cates")
    // 定义过期时间为一周
    const empire = 1000 * 60 * 60 * 24 * 7
    if (!Cates || Date.now() - Cates.time > empire) {
      // 本地存储中没有旧数据或者本地存储中的旧数据已经过期
      // 重新发起请求获取新的数据
      this.getCates()
    } else {
      // 本地存储中有旧数据且没有过期
      // 可以直接使用旧数据
      this.Cates = Cates.data
      let leftMenuList = this.Cates.map((v) => v.cat_name)
      let rightContent = this.Cates[0].children
      this.setData({
        leftMenuList,
        rightContent,
      })
    }
  },

  // 获取分类数据 使用 es7 的 async 和 await 发送异步请求
  async getCates() {
    const result = await request({ url: "/categories" })
    this.Cates = result
    // 把接口的数据存到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates })
    // 构造左侧的菜单数据
    let leftMenuList = this.Cates.map((v) => v.cat_name)
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent,
    })
  },

  // 左侧菜单点击事件
  handleItemTap(e) {
    const { index } = e.currentTarget.dataset
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0,
    })
  },
})
