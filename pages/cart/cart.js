import { chooseAddress, showModal, showToast } from "../../utils/asyncWx.js"

Page({
  data: {
    // 收货地址
    address: {},
    // 购物车数据
    cart: [],
    // 全选的状态
    allChecked: false,
    // 商品总价格
    totalPrice: 0,
    // 商品总数量
    totalNum: 0,
  },

  onShow() {
    // 获取收货地址和购物车数据
    const address = wx.getStorageSync("address") || {}
    const cart = wx.getStorageSync("cart") || []
    this.setCart(cart)
    this.setData({
      address
    })
  },

  // 点击添加收货地址触发的事件
  async handleChooseAddress() {
    try {
      let address = await chooseAddress()
      address.all =
        address.provinceName +
        address.cityName +
        address.countyName +
        address.detailInfo
      wx.setStorageSync("address", address)
    } catch (error) {
      console.error(error)
    }
  },

  // 点击每一种商品复选框的事件处理函数
  handleItemChange(e) {
    const { id } = e.currentTarget.dataset
    let cart = JSON.parse(JSON.stringify(this.data.cart))
    // 获取当前点击的商品在购物车数组中的索引
    const index = cart.findIndex(v => v.goods_id === id)
    // 对点击的商品的选中状态取反
    cart[index].checked = !cart[index].checked
    // 重新设置回缓存中
    wx.setStorageSync('cart', cart)
    this.setCart(cart)
  },

  // 点击全选/全不选的事件处理函数
  handleCheckAll() {
    let cart = JSON.parse(JSON.stringify(this.data.cart))
    cart.forEach((v) => v.checked = !this.data.allChecked)
    wx.setStorageSync("cart", cart)
    this.setCart(cart)
  },

  // 点击商品数量加或者减的事件处理函数
  async handleChangeNumber(e) {
    const { operation, id } = e.currentTarget.dataset
    let cart = JSON.parse(JSON.stringify(this.data.cart))
    // 获取当前点击的商品在购物车数组中的索引
    const index = cart.findIndex((v) => v.goods_id === id)
    if (cart[index].num <= 1 && operation === -1) {
      const res = await showModal({ content: "确定删除该商品？" })
      if (res.confirm) {
        cart.splice(index, 1)
        wx.setStorageSync("cart", cart)
        this.setCart(cart)
      }
    } else {
      cart[index].num += operation
      wx.setStorageSync("cart", cart)
      this.setCart(cart)
    }
  },

  // 点击结算的事件处理函数
  async handlePay() {
    if (!this.data.address.userName) {
      await showToast({ title: '您还没有选择收货地址！' })
      return;
    }
    if (!this.data.totalNum) {
      await showToast({ title: "您还没有选购商品！" })
      return
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay'
    })
  },

  // 计算商品的全选状态以及总价格和总数量
  setCart(cart) {
    // 计算全选状态
    const allChecked = cart.length ? cart.every((v) => v.checked) : false
    // 计算商品的总价格和总数量
    const totalPrice = cart.reduce((previous, current) => {
      return (
        previous + (current.checked ? current.goods_price * current.num : 0)
      )
    }, 0)
    const totalNum = cart.reduce((previous, current) => {
      return previous + (current.checked ? current.num : 0)
    }, 0)
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum,
    })
  }
})