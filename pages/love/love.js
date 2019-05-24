// pages/love/love.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loveArr: [
      { head: "", name: "", time: "", img: "", uid: "", object_id:"" },
    ],
    notComment:"",
    page: 1, //从第二页开始加载 
    page_size: 15, //每页加载15个
    scrollTop: 0,    //上顶
    scrollHeight: 0,  //内置高度
    hidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userid = app.d.userId; //点赞者id

    wx.getSystemInfo({
      success: function (res) {
//        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    })
  },
  GetList: function (that) {
    var that = this;
    var userid = app.d.userId;
    that.setData({
      hasMoreData: false
    })
    var page = that.data.page;
    var page_size = that.data.page_size;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Message/lovelist',
      method: 'POST',
      data: {
        page: page,
        page_size: page_size,
        userid: userid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        //console.log(res);
        var res = res.data;
        if (res == '') {
          that.setData({
            notComment: '暂无数据'
          })
          wx.showToast({
            title: '还没有人给你的评论点赞',
            duration: 1000,
            icon: 'none'
          })
          setTimeout(function(){
            wx.reLaunch({
              url: "/pages/message/message"
            })
          },1000)
        }
        var loveArr = [];
        for (var i in res) {
          loveArr.push({
            head: res[i].avatar,
            name: res[i].user_nickname,
            time: res[i].create_time,
            img: res[i].thumbnail,
            uid: res[i].uid,
            object_id: res[i].object_id
          })
          that.setData({
            loveArr: loveArr
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
  toUser(e) {
    var id = e.currentTarget.dataset.id;
    var userid = app.d.userId;
    if (id == userid) {
      setTimeout(function () {
        wx.reLaunch({
          url: "/pages/person/person"
        })
      }, 300);
    } else {
      wx.navigateTo({
        url: '/pages/userinfo/userinfo?id=' + id,
      })
    }
  },
  toComment(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/indexComment/indexComment?id=' + id,
    })
  }
})