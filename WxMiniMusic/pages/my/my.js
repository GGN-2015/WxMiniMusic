//const { Texture } = require("XrFrame/kanata/lib/index");
const GlobalDominName = getApp().globalData.globalDominName;
const GlobalPort = getApp().globalData.globalPort;

function SendHttpRequest(PageItem, DominName, Port, Datas, TidyFunction) {
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
        fail: function (err) {
            console.log({
                err
            })
            console.log("请求数据失败");
        }
    })
}

// pages/my/my.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLogin: false,
        avatarUrl: "",
        nickName: "",
        collection: [],
        motto: ""
    },
    handleTap(e) {
        /*if(islogin){
          wx.showToast({title:'您未登录',icon:'success',mask:true});
        }*/
        var PageItem = this;
        if (this.data.isLogin != true) {
            getApp().TryLogin(function() {
                PageItem.setData({
                    isLogin: true,
                    avatarUrl: getApp().globalData.userInfo.avatarUrl,
                    nickName: getApp().globalData.userInfo.nickName
                })
                SendHttpRequest(PageItem, GlobalDominName, GlobalPort, {
                    type: "Collection",
                    nickName: PageItem.data.nickName
                }, ret => {
                    PageItem.setData({
                        collection: ret.result
                    })
                })
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.ResetCollection();
        this.GetRandomMotto()
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
        this.ResetCollection()
        this.GetRandomMotto()
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

    },

    UnFollow(e) {
        var PageItem = this;
        wx.showModal({
            title: '确定要取消收藏吗',
            content: '可以在歌曲详情页重新收藏',
            complete: (res) => {
                if (res.cancel) {
                    // do nothing
                }

                if (res.confirm) {
                    // UnFollow
                    const name = e.currentTarget.dataset.name;
                    SendHttpRequest(PageItem, GlobalDominName, GlobalPort, {
                        type: 'UnFollow',
                        nickName: this.data.nickName,
                        name
                    }, (ret) => {
                        this.setData({
                            collection: ret.result
                        })
                    })
                }
            }
        })
    },

    ResetCollection() {
        var PageItem = this;
        if(getApp().isLogin()) {
            PageItem.setData({
                isLogin: true,
                avatarUrl: getApp().globalData.userInfo.avatarUrl,
                nickName: getApp().globalData.userInfo.nickName
            })
            SendHttpRequest(PageItem, GlobalDominName, GlobalPort, {
                type: "Collection",
                nickName: PageItem.data.nickName
            }, ret => {
                PageItem.setData({
                    collection: ret.result
                })
            })
        }
    }, 

    GetRandomMotto() {
        SendHttpRequest(this, GlobalDominName, GlobalPort, {
            type: "GetRandomMotto"
        }, ret => {
            this.setData({
                motto: ret.result
            })
        })
    }
})