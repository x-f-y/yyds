import { request } from "../../request/index.js"

Page({
  data: {
    // 商品详情数据
    goodsObj: {},
    // 当前商品是否被收藏
    isCollected: false
  },

  onShow() {
    // 获取页面跳转传递过来的参数 goods_id
    const pages = getCurrentPages()
    let { goods_id } = pages[pages.length - 1].options
    goods_id = parseInt(goods_id)
    // 根据 goods_id 发送异步请求获取商品详情数据
    this.getGoodsDetail(goods_id)
    // 判断当前商品是否已经被收藏
    const collect = wx.getStorageSync("collect") || []
    const isCollected = collect.some((v) => v.goods_id === goods_id)
    this.setData({
      isCollected
    })
  },

  // 发送异步请求获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: "/goods/detail",
      data: {
        goods_id,
      },
    })
    this.setData({
      goodsObj: {
        goods_id: goodsObj.goods_id,
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_number: goodsObj.goods_number,
        goods_introduce: goodsObj.goods_introduce,
        // goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, ".jpg"),
        goods_small_logo: goodsObj.goods_small_logo,
        pics: goodsObj.pics,
      },
    })
  },

  // 点击轮播图放大预览
  handlePreviewImage(e) {
    const { index } = e.currentTarget.dataset
    wx.previewImage({
      current: this.data.goodsObj.pics[index].pics_mid,
      urls: this.data.goodsObj.pics.map((v) => v.pics_mid),
    })
  },

  // 点击商品收藏
  handleCollect() {
    const collect = wx.getStorageSync('collect') || []
    if (this.data.isCollected) {
      const index = collect.findIndex(v => v.goods_id === this.data.goodsObj.goods_id)
      collect.splice(index, 1)
      wx.showToast({
        title: '取消收藏成功',
        icon: 'success',
        mask: true
      })
    } else {
      collect.push(this.data.goodsObj)
      wx.showToast({
        title: "收藏成功",
        icon: "success",
        mask: true,
      })
    }
    wx.setStorageSync('collect', collect)
    this.setData({
      isCollected: !this.data.isCollected
    })
  },

  // 点击加入购物车
  handleAddCart() {
    let cart = wx.getStorageSync("cart") || []
    // 判断当前商品是否已经存在于购物车中
    let index = cart.findIndex(
      (v) => v.goods_id === this.data.goodsObj.goods_id
    )
    if (index === -1) {
      // 不存在于购物车中
      // 构造一个新的商品对象，将其添加到购物车中
      let newGoodObj = {
        goods_id: this.data.goodsObj.goods_id, // 商品 ID
        goods_name: this.data.goodsObj.goods_name, // 商品名称
        goods_price: this.data.goodsObj.goods_price, // 商品价格
        goods_number: this.data.goodsObj.goods_number, // 商品数量
        goods_small_logo: this.data.goodsObj.goods_small_logo, // 商品小图标
        num: 1, // 初始数量为 1
        checked: true, // 选中状态 默认为 true
      }
      cart.push(newGoodObj)
    } else {
      // 存在于购物车中
      // 商品数量 +1
      cart[index].num++
    }
    wx.setStorageSync("cart", cart)
    wx.showToast({
      title: "添加成功",
      icon: "success",
      mask: true,
    })
  },
})
