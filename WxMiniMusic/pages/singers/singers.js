// pages/singers/singers.js
// pages/genre/genre.js


const GlobalDominName = getApp().globalData.globalDominName
const GlobalPort = getApp().globalData.globalPort

function SendHttpRequest(PageItem, DominName, Port, Datas, TidyFunction) {
    wx.request({
      url: 'http://' + DominName + ':' + Port,
      method: 'POST',
      header: { 
        'Content-Type': 'text/json',
      },
      data: Datas,
      success: function(res) {
        console.log("请求数据成功");
        TidyFunction(res.data);
      },
      fail: function() {
        console.log("请求数据失败");
      },
      complete: function() {
        // complete 
      }
    })
  }
Page({
    /**
     * 页面的初始数据
     */
    selected: function(e){
      
      console.log(e)
       var id = e.currentTarget.dataset.id 
       SendHttpRequest(this, GlobalDominName, GlobalPort, {
        type: 'ComposerTypeDetail',
        name: id
    }, (ret) => {
        console.log(ret)
        this.setData({test:ret.result})
    })

    },
    data: {
      itemList: [],
      test:[],
   
      },
   
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
       
        SendHttpRequest(this,GlobalDominName, GlobalPort, {
            type: "ComposerType",
          }, (ret)=>{
            console.log(ret)
            this.setData({itemList:ret.result})
          })

          var id = options.id
          SendHttpRequest(this,GlobalDominName, GlobalPort, {
            type: 'ComposerTypeDetail',
            name: id
        }, (ret) => {
            console.log(ret)
            this.setData({test:ret.result})
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