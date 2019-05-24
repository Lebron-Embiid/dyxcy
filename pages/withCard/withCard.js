// pages/withCard/withCard.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardName:"",
    cardNumber:"",
    cardBank:"",
    cardPrice:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var userid = app.d.userId;
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/message',
      method: 'POST',
      data: {
        userid: userid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var res = res.data;
        that.setData({
          cardName: res.user_nickname,
          cardPrice: res.balance
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
 * 银行提现
 */
  carTixian:function(e){
    wx.showToast({
      title: "当前SDK版本过低,无法操作",
      duration: 2000,
      icon: 'none'
    });
    return false;
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