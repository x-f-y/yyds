Page({
  data: {
    tabs: [
      {
        id: 0,
        name: "体验问题",
        isActive: true,
      },
      {
        id: 1,
        name: "商品、商家投诉",
        isActive: false,
      },
    ],
    // tab 栏背景颜色
    tabBgColor: "#fff",
    // 用户选择的图片路径数组
    imgPathArr: [],
    // 文本域中的值
    txtValue: "",
  },

  // 外网的图片路径数组
  UploadImgs: [],

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

  // 点击 “+” 号选择图片触发的事件监听函数
  handleChooseImgs() {
    wx.chooseMedia({
      count: 9, // 最多可以选择的文件个数
      mediaType: ["image", "video"], // 文件类型
      source: ["album", "camera"], // 图片和视频选择的来源
      maxDuration: 30, // 拍摄视频最长拍摄时间，单位秒
      camera: "back", // 仅在 sourceType 为 camera 时生效，使用前置或后置摄像头
      success: (res) => {
        const imgPathArr = res.tempFiles.map((v) => v.tempFilePath)
        this.setData({
          imgPathArr: [...this.data.imgPathArr, ...imgPathArr],
        })
      },
    })
  },

  // 点击 icon 删除图片
  handleDeleteImg(e) {
    // 获取被点击图片的索引
    const { index } = e.currentTarget.dataset
    let imgPathArr = JSON.parse(JSON.stringify(this.data.imgPathArr))
    imgPathArr.splice(index, 1)
    this.setData({
      imgPathArr,
    })
  },

  // 文本域中的值发生改变就会触发的事件
  handleTxtInput(e) {
    this.setData({
      txtValue: e.detail.value,
    })
  },

  // 点击提交按钮触发的事件
  handleFormSubmit() {
    // 获取文本域的内容和图片数组
    const { imgPathArr, txtValue } = this.data
    // 合法性验证
    if (!txtValue.trim()) {
      wx.showToast({
        title: "输入不合法",
        icon: "none",
        mask: true,
      })
      return
    }
    wx.showLoading({
      title: "提交中",
      mask: true,
    })
    if (imgPathArr.length) {
      // 遍历图片数组，挨个上传至服务器，从而获取外网链接
      imgPathArr.forEach((v, i) => {
        wx.uploadFile({
          url: "https://img.coolcr.cn/api/upload",
          filePath: v,
          name: "image",
          success: (res) => {
            this.UploadImgs.push(JSON.parse(res.data).data.url)
            // 判断所有文件是否都上传成功
            if (this.data.imgPathArr.length === this.UploadImgs.length) {
              wx.hideLoading({
                success: () => {
                  wx.showToast({
                    title: "提交成功",
                    icon: "success",
                    mask: true,
                  })
                },
              })
              // 将外网图片路径数组和文本域内容提交到后台 这里用 log 来模拟
              console.log({
                status: "成功",
                msg: "提交了外网图片路径数组和文本域内容",
              })
              // 重置页面状态
              this.setData({
                imgPathArr: [],
                txtValue: "",
              })
              // 返回上一级页面
              wx.navigateBack({
                delta: 1,
              })
            }
          },
        })
      })
    } else {
      wx.hideLoading({
        success: () => {
          wx.showToast({
            title: "提交成功",
            icon: "success",
            mask: true,
          })
        },
      })
      console.log({
        status: "成功",
        msg: "仅提交了文本域内容",
      })
      this.setData({
        txtValue: "",
      })
      wx.navigateBack({
        delta: 1,
      })
    }
  },
})
