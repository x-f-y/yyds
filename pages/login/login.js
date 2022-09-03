import { getUserProfile } from "../../utils/asyncWx.js"

Page({
  async handleGetUserProfile() {
    const res = await getUserProfile({
      desc: "获取用户个人信息",
    })
    const userInfo = {
      avatarUrl: res.userInfo.avatarUrl,
      nickName: res.userInfo.nickName
    }
    wx.setStorageSync("userInfo", userInfo);
    wx.navigateBack({
      delta: 1
    })
  }
})