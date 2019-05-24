// pages/recharge/recharge.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id;
    //充值
    this.setData({
      id:options.id
    })
  },
  formSubmit(e){
    var that = this;
    var info = e.detail.value;
    var userid = that.data.id;
    info.userid = userid;

    wx.request({
      url: app.d.ceshiUrl + '/api/Money/charge',
      method: 'POST',
      data: info,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
        var arr = res.data.arr;
        wx.requestPayment({
          timeStamp: arr.timeStamp,
          nonceStr: arr.nonceStr,
          package: arr.package,
          signType: 'MD5',
          paySign: arr.paySign,
          success: function (res) {
            wx.request({
              url: app.d.ceshiUrl + '/Api/Money/user',
              method: 'POST',
              data: info,
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success:function(res){
                //用户充值成功
                wx.showToast({
                  title: "支付成功!",
                  duration: 2000,
                });
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/person/person'
                  });
                }, 2500);
              }
            })
            
          }, 
          fail: function (e) {
            wx.showToast({
              title: '支付失败！',
              duration: 2000
            });
          },
        })
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})