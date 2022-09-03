// 同时发送异步请求的次数
let ajaxTimes = 0
export const request = (params) => {
    // 判断 url 中是否带有 /my/，有则加上请求头 Authorization: token
    let header = { ...params.header }
    if (params.url.includes('/my/')) {
        header['Authorization'] = wx.getStorageSync('token');
    }
    ajaxTimes++
    // 定义公共的 url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1" 
    return new Promise((resolve, reject) => {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        wx.request({
            ...params,
            header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
                ajaxTimes--
                if (ajaxTimes === 0) {
                    wx.hideLoading()
                }
            }
        })
    })
}