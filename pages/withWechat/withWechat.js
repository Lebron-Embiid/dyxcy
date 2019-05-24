// pages/withWechat/withWechat.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxName: "",
    wxPrice: "",
    codeImg: "",
    hidden: false
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
      success:function(res){
        var res = res.data;
        that.setData({
          wxName: res.user_nickname,
          wxPrice: res.balance,
          // codeImg: res.wx_code
        });
        if (res.wx_code){
          that.data.hidden = true
        }else{
          that.data.hidden = false
        }
        that.setData({
          hidden: that.data.hidden
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
  
  },
  /**
   * 提现
   */
  tixian(e){
    wx.showToast({
      title: "当前SDK版本过低,无法操作",
      duration: 2000,
      icon: 'none'
    });
    return false;
  },
  chooseImg(e) {
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var data = res.data;
            this.setData({
              noImg: false
            })
            //do something
          }
        })
      }
    })
  }
})