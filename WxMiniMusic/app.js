// app.js
App({
    onLaunch() {
        // 展示本地存储能力
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
    },
    globalData: {
        userInfo: null,
        globalDominName: "127.0.0.1",
        globalPort: 1200,
    },
    isLogin() {
        return this.globalData.userInfo != null
    },
    TryLogin(success) {
        wx.getUserProfile({
            desc: '用于绑定收藏夹',
            success: ret => {
                this.globalData.userInfo = ret.userInfo
                success()
            }
        })
    }
})