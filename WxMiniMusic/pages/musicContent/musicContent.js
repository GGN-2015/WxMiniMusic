// pages/musicContent/musicContent.js
var GLobalIsPlay = false
var GLobalStepperId = 0
var GlobalSliderPos = 0
var GlobalPriorityPos = 0;
var GlobalTimePast = 0;
var GlobalDone = false; // 是否完成了初始化

function GetStaticRotation() {
    const deg = GlobalTimePast / 20 * 360;
    console.log({deg})
    return "none; transform: rotate(" + deg + "deg)";
}

const GlobalDominName = getApp().globalData.globalDominName
const GlobalPort = getApp().globalData.globalPort

const TIME_BREAK = 150;

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
        fail: function () {
            console.log("请求数据失败");
        },
        complete: function () {
            // complete 
        }
    })
}

function SetGlobalIsPlay(PageItem, flag) {
    GLobalIsPlay = flag;
    PageItem.setData({
        isPlay: flag
    })
}

function BeginStepper(PageItem, timeStep, stepperId) {
    if (GlobalSliderPos == 100) {
        SetGlobalIsPlay(PageItem, false)
        PageItem.setData({
            isPlay: false,
            animation: GetStaticRotation()
        })
        GLobalIsPlay = false
        GlobalDone = false
        var bgmM = wx.getBackgroundAudioManager()
        GlobalSliderPos = 0
        PageItem.setData({
            sliderPos: 0
        })
        bgmM.title = "tmp"
        bgmM.src = PageItem.data.musicInfo.source
        wx.showLoading({
          title: '玩命加载中',
        })
        setTimeout(function() {
            Stopper()
        }, TIME_BREAK * 2)
        return
    }
    if (GLobalIsPlay === true && GLobalStepperId === stepperId) {
        setTimeout(function () {
            GlobalTimePast += timeStep;
            if (GLobalStepperId === stepperId) {
                var sliderPos;

                if (GlobalPriorityPos < 0) {
                    sliderPos = GlobalSliderPos + (100 / 300);
                } else {
                    sliderPos = GlobalPriorityPos;
                    GlobalPriorityPos = -1;
                }
                if (sliderPos < 0) sliderPos = 0;
                if (sliderPos > 100) sliderPos = 100;
                GlobalSliderPos = sliderPos;

                console.log({
                    stepperId,
                    sliderPos,
                    timeStep
                })
                if (GLobalStepperId === stepperId && GLobalIsPlay) {
                    PageItem.setData({
                        sliderPos: GlobalSliderPos
                    })
                }
                BeginStepper(PageItem, timeStep, stepperId)
            }
        }, timeStep * 1000);
    }
}

function RandInt(n, m) {
    return parseInt(Math.random() * (m - n) + n);
}

function SetMusicAndStop(PageObj, music_url) {
    var bgmM = wx.getBackgroundAudioManager()
    bgmM.src = music_url;
    bgmM.title = "tmp"
    SetGlobalIsPlay(PageObj, false)
}

function Stopper(cnt = 9) {
    if(cnt > 9) {
        wx.showLoading({
          title: '玩命加载中',
        })
    }
    console.log("run stopper()")
    var bgmM = wx.getBackgroundAudioManager()
    if(!(bgmM.paused === true) || cnt > 0) {
        bgmM.pause()
        setTimeout(function() {
            Stopper(cnt - 1)
        }, TIME_BREAK)
    }else {
        setTimeout(function() {
            GlobalDone = true; // 初始化完成
            wx.hideLoading()
        }, TIME_BREAK)
    }
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        sliderPos: 0,
        animation: 0,
        name: "", // 音乐名称跳转携带过来的参数
        musicInfo: {},
        isLogin: false,
        followed: false,
        nickName: "",
        avatarUrl: "",
        isPlay: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        GLobalIsPlay = false;
        GLobalStepperId = 0;
        GlobalSliderPos = 0;
        GlobalPriorityPos = 0;
        GlobalTimePast = 0;
        GlobalDone = false;
        
        try {
            this.data.name = options.name;
        }catch(err) {
            this.data.name = "测试歌曲";
        }
        if(getApp().isLogin()) {
            this.setData({
                isLogin: true,
                nickName: getApp().globalData.userInfo.nickName,
                avatarUrl: getApp().globalData.userInfo.avatarUrl
            })
            this.UpdateFollow()
        }
        SendHttpRequest(this, GlobalDominName, GlobalPort, {
            type: "MusicInfoDetail",
            name: this.data.name
        }, (ret) => {
            if (ret.found == true) {
                this.setData({
                    musicInfo: ret.result
                })
                try {
                    SetMusicAndStop(this, this.data.musicInfo.source)
                } catch (err) {
                    console.log(err)
                }
            } else {
                // TODO
                wx.showToast({
                    title: '音乐加载失败',
                    icon: 'error'
                })
                setTimeout(function() {
                    wx.redirectTo({
                      url: '../../pages/home/home',
                    })
                }, TIME_BREAK * 10)
            }
        })
    },

    timeSliderChanged(e) {
        var bgmM = wx.getBackgroundAudioManager()
        const rate = (e.detail.value / 100)

        this.setData({
            sliderPos: e.detail.value
        })
        var PageItem = this

        setTimeout(function () { // 此处需要异步调用相关接口
            const posNow = rate * bgmM.duration;
            bgmM.seek(posNow);
            if(!bgmM.paused) bgmM.pause()

            PageItem.setData({
                animation: GetStaticRotation()
            })
            setTimeout(function () {
                SetGlobalIsPlay(PageItem, false)
                GlobalSliderPos = e.detail.value;
                GlobalPriorityPos = e.detail.value;

                console.log(posNow);
            }, TIME_BREAK);
        }, TIME_BREAK)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        Stopper(10)
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        if (GLobalIsPlay == true) {
            var bgmM = wx.getBackgroundAudioManager()
            if(!bgmM.paused) bgmM.pause()
        }
        GlobalPriorityPos = 0
        GLobalStepperId = RandInt(0, 1000000000)
        Stopper()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        wx.showLoading({
          title: '玩命恢复中',
        })
        if (GLobalIsPlay == true) {
            var bgmM = wx.getBackgroundAudioManager()
            if(!bgmM.paused) bgmM.pause()
        }
        GlobalPriorityPos = 0
        GLobalStepperId = RandInt(0, 1000000000)
        Stopper()
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

    PauseOrPlay(e) {
        if(GlobalDone == false) return // 初始化未完成

        if (GLobalIsPlay === true) { // 暂停
            SetGlobalIsPlay(this, false)
            console.log({
                GLobalIsPlay
            })

            var bgmM = wx.getBackgroundAudioManager()
            if(!bgmM.paused) bgmM.pause()
            this.setData({
                animation: GetStaticRotation()
            })
            GlobalTimePast = 0; // 假设新的旋转从初始位置开始
        } else { // 启动
            SetGlobalIsPlay(this, true)
            console.log({
                GLobalIsPlay
            })

            var bgmM = wx.getBackgroundAudioManager()
            var PageItem = this;
            setTimeout(function () {
                const duration = bgmM.duration;
                const timeStep = duration / 300; // 百分之一所需要的时间
                GLobalStepperId = RandInt(0, 10000000000);

                // 开始播放音乐
                const timeNow = (GlobalSliderPos / 100) * duration;
                const realTimeNow = bgmM.currentTime;

                if(Math.abs(timeNow - realTimeNow) >= 5) {
                    console.log({
                        timeNow, realTimeNow
                    })
                    bgmM.seek(timeNow)
                }else {
                    console.log("goes on")
                }
                bgmM.play()
                PageItem.setData({
                    animation: "rotate 20s linear infinite"
                })

                console.log({
                    GLobalStepperId,
                    timeStep
                })
                BeginStepper(PageItem, timeStep, GLobalStepperId);
            }, TIME_BREAK)
        }
    },

    TryLogin(e) {
        if (this.data.isLogin == false) {
            var PageItem = this;
            if (!getApp().isLogin()) {
                getApp().TryLogin(function () {
                    const nickName = getApp().globalData.userInfo.nickName;
                    PageItem.setData({
                        isLogin: true,
                        nickName,
                        avatarUrl: getApp().globalData.userInfo.avatarUrl
                    })
                    PageItem.UpdateFollow()
                })
            }
        }
    },

    SetFollow(e) {
        SendHttpRequest(this, GlobalDominName, GlobalPort, {
            type: "SetFollow",
            nickName: this.data.nickName,
            name: this.data.name
        }, (ret) => {
            var followed = false;
            ret.result.forEach(v => {
                if (v.name == this.data.name) {
                    followed = true
                }
            })
            this.setData({
                followed
            })
            wx.showToast({
              title: '收藏成功',
            })
        })
    },

    UpdateFollow() {
        var PageItem = this
        SendHttpRequest(PageItem, GlobalDominName, GlobalPort, {
            type: "Collection",
            nickName: getApp().globalData.userInfo.nickName
        }, (ret) => {
            var followed = false;
            ret.result.forEach(v => {
                if (v.name == PageItem.data.name) {
                    followed = true
                }
            })
            PageItem.setData({
                followed
            })
        })
    },

    UnFollow(e) {
        SendHttpRequest(this, GlobalDominName, GlobalPort, {
            type: 'UnFollow',
            nickName: this.data.nickName,
            name: this.data.name
        }, ret => {
            this.setData({
                followed: false,
            })
            wx.showToast({
              title: '取消成功',
            })
        })
    }
})