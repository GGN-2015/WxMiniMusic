// pages/my/my.js

const GlobalDominName = getApp().globalData.globalDominName
const GlobalPort = getApp().globalData.globalPort

function SendHttpRequest(PageItem, DominName, Port, Datas, TidyFunction) {
    PageItem.setData({
        httpRetObj: "{}"
    })
    wx.request({
        url: 'http://' + DominName + ':' + Port,
        method: 'POST',
        header: {
            'Content-Type': 'text/json',
        },
        data: Datas,
        success: function (res) {
            console.log("请求数据成功");
            TidyFunction(res.data);
        },
        fail: function () {
            console.log("请求数据失败");
        },
        complete: function () {
            // complete 
        }
    })
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ms: [],
        pr: [],
        focus: false
    },
    handlefocus(e) {
        this.setData({
            focus: true
        })
    },
    handletap(e) {
        this.setData({
            focus: false
        })
        this.setData({
            inputValue: ""
        })
        this.setData({
            ms: []
        })
    },
    handleinput(e) {
        console.log(e)

        SendHttpRequest(this, GlobalDominName, GlobalPort, {
            type: "MusicSearch",
            match: e.detail.value
        }, (ret) => {
            console.log(ret)
            this.setData({
                ms: ret.result
            })
        })


    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options.id)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})