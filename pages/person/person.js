// pages/person/person.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    navbar: [
      { name: "图片", num: "" },
      { name: "收藏", num: "" },
      { name: "作品", num: "" }
    ],
    avatar : "",
    name: "",
    info: "他很懒，还没有个性签名",
    address: "",
    sex: "保密",
    age: "18",
    code: "/images/code.jpg",
    love: "0",
    fans: "0",
    atten: "0",
    id : "0",
    collect:"",
    labelArr: [
      { name: ""}
    ],

    photoArr: [
      { src: ""},
    ],
    collectArr: [
      { src: "", num: "", url: "", id: "", object_id:"" },
    ],
    worksArr: [
      { src: "", num: "",url:"",id:"" },
    ],

    show: false,
    fansShow: false,
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.isLogin();
    var userid = app.d.userId;
  
    //用户发布图片的總數
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/pcount',
      method: 'POST',
      data: { userid: userid },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var nav = that.data.navbar;
        nav[0].num = res.data;
        that.setData({
          navbar: nav
        })
      }
    })
    //用戶收藏的總數
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/fcount',
      method: 'POST',
      data: { userid: userid },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var nav = that.data.navbar;
        nav[1].num = res.data;
        that.setData({
          navbar: nav
        })
      }
    })
    //用户发布视频的總數
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/vcount',
      method: 'POST',
      data: { userid: userid },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var nav = that.data.navbar;
        nav[2].num = res.data;
        that.setData({
          navbar: nav,
          video : 2
        })
      }
    })
    
    
    //用户所有信息和他发布的所有作品
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/info',
      method: 'POST',
      data: { userid: userid },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var user = res.data;
        //用戶標籤
        wx.request({
          url: app.d.ceshiUrl + '/Api/Message/labellimit',
          method: 'POST',
          data: { userid: userid },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.setData({
              labelArr: res.data
            })
          }
        })
        
        that.UserFavorite();//用戶收藏
        
        that.fans();//用户的粉丝数量
        
        that.attenCount();//用户关注数量
        //遍历用户发布的所有图片
        var photoArr = [];
        for (var i in user.thumbnail) {
          var src = [];
          if(user.thumbnail[i].length == 1){
            src.push(user.thumbnail[i][0])
          }else{
            for (var j in user.thumbnail[i]) {
              src.push(user.thumbnail[i][j])
            }
          }
          photoArr.push({
            src: src
          })
        }
        
        that.video();//遍历用户发布的所有视频
        that.setData({
          id:user.id,
          name: user.user_nickname,
          avatar: user.avatar,
          age: user.age,
          love: user.receive_like_counts,
          address: user.user_city,
          info: user.user_info,
          code: user.wx_code,
          photoArr: photoArr,
        })
        //性別
        if (user.sex == 0) {
          that.data.sex = '保密'
        } else if (user.sex == 1) {
          that.data.sex = '男'
        } else {
          that.data.sex = '女'
        }
        that.setData({
          sex: that.data.sex,
        })
      },
      fail: function (res) {

      }
    })
  },
//用戶收藏
UserFavorite:function(){
  var userid = app.d.userId;
  var that = this;
  wx.request({
    url: app.d.ceshiUrl + '/Api/User/UserFavorite',
    method: 'POST',
    data: { userid: userid },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var user = res.data;
      var collectArr = [];
      for (var i in user) {
        collectArr.push({
          src: user[i].thumbnail,
          url: user[i].url,
          id: user[i].id,
          object_id: user[i].object_id,
          num: user[i].num,
        })
      }
      that.setData({
        collectArr: collectArr
      })
    }
  })
},
//用户的粉丝数量
fans:function(){
  var userid = app.d.userId;
  var that = this;
  wx.request({
    url: app.d.ceshiUrl + '/Api/User/fansCount',
    method: 'POST',
    data: { userid: userid },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      that.setData({
        fans: res.data
      })
    }
  })
},
//用户关注数量
attenCount:function(){
  var userid = app.d.userId;
  var that = this;
  wx.request({
    url: app.d.ceshiUrl + '/Api/User/attenCount',
    method: 'POST',
    data: { userid: userid },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      that.setData({
        atten: res.data
      })
    }
  })
},
//遍历用户发布的所有视频
video:function(){
  var userid = app.d.userId;
  var that = this;
  wx.request({
    url: app.d.ceshiUrl + '/Api/User/video',
    method: 'POST',
    data: { userid: userid },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var res = res.data;
      var worksArr = [];
      for (var i in res) {
        worksArr.push({
          src: res[i].thumbnail,
          url: res[i].post_content,
          num: res[i].num,
          id: res[i].arid
        });
      }
      that.setData({
        worksArr: worksArr
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
    this.onLoad();
    var photoLen = this.data.photoArr.length;
    var collectLen = this.data.collectArr.length;
    var worksLen = this.data.worksArr.length;
    this.data.navbar[0].num = photoLen;
    this.data.navbar[1].num = collectLen;
    this.data.navbar[2].num = worksLen;
    this.setData({
      navbar: this.data.navbar
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (options) {
    
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
  navbarTap(e){
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  showSettings(e){
    this.setData({
      show: true
    })
  },
  closeShow(e){
    this.setData({
      show: false
    })
  },
  toAddLabel(e){
    wx.navigateTo({
      url: '/pages/label/label',
    })
  },
  attenPerson(e) {
    var that = this;
    if (that.data.fansShow == false) {
      that.data.fansShow = true;
      wx.showToast({
        title: '您不能关注自己',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      that.data.fansShow = false;
    }
    that.setData({
      fansShow: that.data.fansShow
    })
  },
  cancleAtten(e) {
    var that = this;
    if (that.data.fansShow == true) {
      that.data.fansShow = false
      wx.showToast({
        title: '您已取消关注',
        icon: 'none',
        duration: 500
      })
    } else {
      that.data.fansShow = true
    }
    that.setData({
      fansShow: that.data.fansShow
    })
  },
  toFans(e){
    wx.navigateTo({
      url: '/pages/fans/fans',
    }) 
  },
  toAtten(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/atten/atten?id='+id,
    })
  },
  previewImg(e) {
    // var id = e.currentTarget.dataset.id;
    // //console.log(this.data.photoArr);
    // var picList = [];
    // for (var i = 0; i < this.data.photoArr[id].src.length;i++){
    //   picList.push(this.data.photoArr[id].src[i]);
    // }
    var srcimg = e.currentTarget.dataset.srcimg;//获取data-src
   // var imgList = e.currentTarget.dataset.list;//获取data-list
    //console.log("这是图片"+picList)
    var picList = [];
    picList.push(srcimg);
    console.log("这是图片" + picList)
    wx.previewImage({
      current: srcimg, // 当前显示图片的http链接
      urls: picList // 需要预览的图片http链接列表
    })
  },
  toDetail(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/video/video?id='+id,
    })
  },
  toFavorite(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/video/video?id=' + id,
    })
  },
  deleteWorks(e) {
    var userid = app.d.userId;
    var did = e.currentTarget.dataset.id; 
    var currentid = e.currentTarget.dataset.current; 
    wx.showModal({
      title: '确定删除该作品？',
      success: function(res){
        if (res.confirm == true) {
          console.log("删除！"+did)
                                        
          wx.request({
            url: app.d.ceshiUrl + '/Api/User/delete_cloth',
            method: 'POST',
            data: { 'did': did, 'userid': userid,'currentid': currentid },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.status != 1) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                });
                return false;
              }   
            }
          })

        }else{
          console.log("取消！")
        }
      }
    })
  },

  
})
