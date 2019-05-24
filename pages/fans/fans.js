// pages/fans/fans.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fansArr: [
      { 
        headImg: "", 
        userName: "", 
        fans: "", 
        work: "", 
        info: "", 
        fansShow: '',
        uid:"",  //粉丝id
        to_userid:"",  //我的id
      },
    ],
    notComment:"",
    page: 1, //从第二页开始加载 
    page_size: 15, //每页加载15个
    scrollTop: 0,    //上顶
    scrollHeight: 0,  //内置高度
    hidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        //console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    })
    
  },
  GetList: function (that) {
    var that = this;
    var userid= app.d.userId;
    that.setData({
      hasMoreData: false
    })
    var page = that.data.page;
    var page_size = that.data.page_size;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Fans/fanslist',
      method: 'POST',
      data: {
        page: page,
        page_size: page_size,
        userid :userid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data.data);
        var res = res.data.data;
        if (res == '') {
          that.setData({
            notComment: '暂无数据'
          })
          wx.showToast({
            title: '当前没有粉丝哦',
            duration: 1000,
            icon: 'none'
          })
          setTimeout(function () {
            wx.reLaunch({
              url: "/pages/message/message"
            })
          }, 1000)
        }
        var fansArr = [];
        for (var i in res) {
          fansArr.push({
            headImg: res[i].avatar,
            userName: res[i].user_nickname,
            fans: res[i].fans_counts,
            work: res[i].num,
            info: res[i].user_info,
            uid: res[i].uid,
            fansShow: res[i].fansShow
          })
          that.setData({
            fansArr: fansArr
          })
        }
        page++;
        that.setData({
          hasMoreData: true
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
  bindDownLoad: function () {
    var that = this;
    that.GetList();
  },
  scroll: function (event) {
    //console.log(event.detail.scrollTop);
    this.setData({
      scrollTop: event.detail.scrollTop
    });
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
    var that = this;
    that.GetList();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 用户关注粉丝
   */
  attenPerson(e){
    //false=0 true=1
    var that = this;
    var idx = e.currentTarget.dataset.show;
    var userid = app.d.userId;   //我的id
    var arr = that.data.fansArr;  
    var fansShow = [];
    var my_to_userid = [];   //我要关注人的id
    var my_to_username = [];  //ta的名字
    var my_to_avatar = [];    //他的头像
    for (var i in arr){
      fansShow.push(arr[i].fansShow);
      my_to_userid.push(arr[i].uid);
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Fans/attenPerson',
      method: 'POST',
      data: { 
        userid: userid, 
        fansShow: fansShow[idx], 
        my_to_userid: my_to_userid[idx],
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
        wx.showToast({
          title: res.data.msg,
          duration: 500
        })
        if (fansShow[idx] == 0) {
          fansShow[idx] = 1;
        } else {
          fansShow[idx] = 0;
        }
        that.data.fansArr[idx].fansShow = fansShow[idx];
        that.setData({
          fansArr: that.data.fansArr
        })
      }
    })
    
  },
  cancleAtten(e){
    if (that.data.fansArr[idx].fansShow == 0) {
      that.data.fansArr[idx].fansShow = 1
      wx.showToast({
        title: '您已关注',
        icon: 'none',
        duration: 500
      })
    } else if (that.data.fansArr[idx].fansShow == 1) {
      that.data.fansArr[idx].fansShow = 0
      wx.showToast({
        title: '您已取消关注',
        icon: 'none',
        duration: 500
      })
    }
    that.setData({
      fansArr: that.data.fansArr
    })
  },
  toUser(e) {
    var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/userinfo/userinfo?id=' + id,
      })
  },
})