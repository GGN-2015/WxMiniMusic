// pages/home/home.js

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
const order = ['demo1', 'demo2', 'demo3']

Page({
    onShareAppMessage() {
        return {
            title: 'scroll-view',
            path: 'page/component/pages/scroll-view/scroll-view'
        }
    },

    data: {
        search: "",
        toView: 'green',
        address: "",
        mc: [],
        pc: [],
        rank: []
    },

    upper(e) {
        console.log(e)
    },

    lower(e) {
        console.log(e)
    },

    scroll(e) {
        console.log(e)
    },

    scrollToTop() {
        this.setAction({
            scrollTop: 0
        })
    },

    tap() {
        for (let i = 0; i < order.length; ++i) {
            if (order[i] === this.data.toView) {
                this.setData({
                    toView: order[i + 1],
                    scrollTop: (i + 1) * 200
                })
                break
            }
        }
    },

    tapMove() {
        this.setData({
            scrollTop: this.data.scrollTop + 10
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        SendHttpRequest(this, GlobalDominName, GlobalPort, {
            type: "Category",
            count: 4
        }, (ret) => {
            console.log(ret)
            this.setData({
                mc: ret.result
            })
        })
        SendHttpRequest(this, GlobalDominName, GlobalPort, {
            type: "ComposerType",
            count: 3
        }, (ret) => {
            console.log(ret)
            this.setData({
                pc: ret.result
            })
        })
        SendHttpRequest(this, GlobalDominName, GlobalPort, {
            type: "MusicRank",
            count: 10
        }, (ret) => {
            console.log(ret)
            this.setData({
                rank: ret.result
            })
        })
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
        this.onLoad()
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