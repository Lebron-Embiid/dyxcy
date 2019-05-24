// pages/label/label.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    labelArr:[],
    fuli:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userid = app.d.userId;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Message/label',
      method:'POST',
      data:{userid:userid},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res){
        that.setData({
          labelArr:res.data
        })
        //console.log(that.data.labelArr);
      }
    });
    //用户选中的标签高亮
    // wx.request({
    //   url: app.d.ceshiUrl + '/Api/Message/labeltrue',
    //   method: 'POST',
    //   data: { userid: userid },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //   },
    //   success: function (res) {
    //     that.setData({
    //       labelArr: res.data
    //     })
    //     //console.log(that.data.labelArr);
    //   }
    // });
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
  toAddLabel(e) {
    wx.navigateTo({
      url: '/pages/addlabel/addlabel',
    })
  },
  selectLight(e){
    var that = this;
    var userid = app.d.userId;
    var id = e.currentTarget.dataset.id;
    var labelid = that.data.labelArr[id]['id'];
    if (that.data.labelArr[id]['select_status'] == 0){
      that.data.labelArr[id]['select_status'] = 1;
      for(var i = 0;i<=that.data.fuli.length;i++){
        // if (that.data.fuli[i] == that.data.labelArr[id]['name']){
          that.data.fuli.splice(i,1);
          wx.request({
            url: app.d.ceshiUrl + '/Api/Message/selecttag',
            method: 'POST',
            data: {
              labelid: labelid,
              userid: userid,
              fuli: that.data.fuli,
              select: 0
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              wx.showToast({
                title: res.data.msg,
                duration: 2000,
              });
              var userId = res.data.userid;             
              wx.redirectTo({
                url: '/pages/label/label?userId=' + userId
              })
            }
          })
        // }
      }
    } else{
      that.data.labelArr[id]['select_status']=0;
      that.data.fuli.push(that.data.labelArr[id]['name']);
      console.log('13213122', that.data.labelArr[id]['select_status']);
      wx.request({
        url: app.d.ceshiUrl + '/Api/Message/selecttag',
        method: 'POST',
        data: {
          userid: userid,
          fuli: that.data.fuli,
          select:1
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success:function(res){
          wx.showToast({
            title:res.data.msg,
            duration: 2000,
          });
        }
      })
      // console.log("选中"+that.data.fuli);
    }
    that.setData({
      labelArr: that.data.labelArr,
      fuli:that.data.fuli
    })
   
  }
})