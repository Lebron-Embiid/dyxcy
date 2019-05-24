// pages/message/message.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageArr:[
      { 
        img: "", 
        post_title: "", 
        post_content: "", 
        published_time: ""
      }
    ],
    page: 1, //从第二页开始加载 
    page_size: 10, //每页加载15个
    scrollTop: 0,    //上顶
    scrollHeight: 0,  //内置高度
    hasMoreData: false,
    text: false,
    endloading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
//        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    })

  },
  GetList:function(that){
    var that = this;
    that.setData({
      hasMoreData: false,
      text: false
    })
    var page = that.data.page;
    var page_size = that.data.page_size;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Message/index',
      method: 'POST',
      data: {
        page: page,
        page_size: page_size
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
        //console.log(res);
        that.setData({
          messageArr: res.data,
        })
        if (res.data.length < that.data.page_size) {
          console.log('加载完了');
          that.setData({
            text: true,
            hasMoreData: true,
            endloading: true, //上拉不在加载
          });
        }
        that.setData({
          hasMoreData: true,
          page_size: page_size + 1
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.GetList();
  },


  scroll: function (event) {
    //console.log(event.detail.scrollTop);
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  refresh: function (event) {
    //  该方法绑定了页面滑动到顶部的事件，然后做上拉刷新

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Message/down',
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
        var res = res.data;
        that.setData({
          messageArr: res,
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var endloading = that.data.endloading
    if (!endloading) {
      that.GetList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
})