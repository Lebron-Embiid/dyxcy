// pages/atten/atten.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attenArr: [
      { 
        headImg: "", 
        userName: "", 
        fans: "", 
        work: "", 
        info: "", 
        to_userid:"",
        isshow: false
      },
    ],
    userid:"",
    id:"",
    notComment: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/useratten',
      method: 'POST',
      data: { id: id },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
        var res = res.data;
        if (res == '') {
          that.setData({
            notComment: " "
          })
          wx.showToast({
            title: '暂无关注',
            duration: 1000,
            icon: 'none'
          })
          wx.reLaunch({
            url: "/pages/message/message"
          })
        }
        var attenArr =[];
        for(var i in res){
          attenArr.push({
            headImg:res[i].avatar,
            userName: res[i].user_nickname,
            fans: res[i].fans_counts,
            work: res[i].num,
            info: res[i].user_info,
            to_userid:res[i].to_userid,
            isshow:true
          })
        }
        that.setData({
          attenArr: attenArr,
          id:id
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
  //关注
  toConcern(e) {
    var that = this;
    var to_userid = e.currentTarget.dataset.id;  //我关注的人的id
    var userid = app.d.userId;  //我的id 
    var idx = e.currentTarget.dataset.idx; //索引
    var arr = that.data.attenArr;
    if (arr[idx].isshow == false) {
      arr[idx].isshow = true;
      wx.request({
        url: app.d.ceshiUrl + '/Api/Concern/searchCon',
        method: 'POST',
        data: {
          userid: userid,
          to_userid: to_userid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if (res.data) {
            wx.showToast({
              title: res.data.msg,
              duration: 2000
            });
          }
        }
      })
    } else {
      arr[idx].isshow = false;
    }
    //console.log(arr[idx].isshow)

    that.setData({
      attenArr: that.data.attenArr
    })
  },
  //取消关注
  delConcern(e) {
    var that = this;
    var to_userid = e.currentTarget.dataset.id;  //我关注的人的id
    var userid = app.d.userId;  //我的id 
    var idx = e.currentTarget.dataset.idx; //索引
    var arr = that.data.attenArr;
    if (arr[idx].isshow == true) {
      arr[idx].isshow = false;
      wx.request({
        url: app.d.ceshiUrl + '/Api/Concern/delete',
        method: 'POST',
        data: {
          userid: userid,
          to_userid: to_userid,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          //console.log(res.data);
          if (res.data) {
            wx.showToast({
              title: res.data.msg,
              duration: 2000
            });
          }
        }
      })
    } else {
      arr[idx].isshow = true;
    }
    that.setData({
      attenArr: that.data.attenArr
    })
  },
  toUser(e) {
    var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/userinfo/userinfo?id=' + id,
      })
  },


  attenPerson1(e) {
    var that = this;
    var idx = e.currentTarget.dataset.show;
    if (that.data.attenArr[idx].fansShow == false) {
      that.data.attenArr[idx].fansShow = true;
      wx.showToast({
        title: '关注成功',
        icon: 'none',
        duration: 500
      })
    } else {
      that.data.attenArr[idx].fansShow = false;
    }
    that.setData({
      attenArr: that.data.attenArr
    })
  },
  cancleAtten(e) {
    var that = this;
    var idx = e.currentTarget.dataset.show;
    var id = that.data.id;
    var attenArr = that.data.attenArr;
    var to_userid = [];
    for (var i in attenArr){
      to_userid.push(attenArr[i].to_userid);
    }
    if (that.data.attenArr[idx].fansShow == true) {
      wx.request({
        url: app.d.ceshiUrl  + '/Api/User/delete',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: { id: id,to_userid:to_userid[idx]},
        success:function(res){
          that.data.attenArr[idx].fansShow = false
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 500
          })
        }
      })
    } else {
      that.data.attenArr[idx].fansShow = true
    }
    that.setData({
      attenArr: that.data.attenArr
    })
  }
})