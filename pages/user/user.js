Page({
  data: {
    userInfo: {},
    // 收藏的商品数量
    collectedNum: 0
  },

  onShow() {
    const userInfo = wx.getStorageSync("userInfo")
    const collect = wx.getStorageSync('collect') || []
    this.setData({
      userInfo,
      collectedNum: collect.length
    })
  },
})