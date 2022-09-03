import { request } from "../../request/index.js"

Page({
  data: {
    tabs: [
      {
        id: 0,
        name: "综合",
        isActive: true,
      },
      {
        id: 1,
        name: "销量",
        isActive: false,
      },
      {
        id: 2,
        name: "价格",
        isActive: false,
      },
    ],
    // 商品列表数组
    goodsList: [],
    // 商品没有对应图片时显示的默认图片
    defaultImage: '../../images/1.jpg'
  },

  // 向接口发送请求需要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },

  // 总页数
  TotalPages: 0,

  onLoad(options) {
    this.QueryParams.cid = options.cid || ''
    this.QueryParams.query = options.query || ''
    this.getGoodsList()
  },

  onReachBottom() {
    if (this.QueryParams.pagenum >= this.TotalPages) {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },

  onPullDownRefresh() {
    // 重置商品列表数组和页码
    this.setData({
      goodsList: []
    })
    this.QueryParams.pagenum = 1
    // 重新发起请求获取数据
    this.getGoodsList()
  },

  // 发送异步请求获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: "/goods/search",
      data: this.QueryParams
    })
    // 获取总页数
    this.TotalPages = Math.ceil(res.total / this.QueryParams.pagesize)
    this.setData({
      // 数组拼接
      goodsList: [...this.data.goodsList, ...res.goods],
    })
    wx.stopPullDownRefresh()
  },

  // 标题点击事件的处理函数
  handleTap(e) {
    const { index } = e.detail
    let tabs = JSON.parse(JSON.stringify(this.data.tabs))
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    )
    this.setData({
      tabs,
    })
  },
})
