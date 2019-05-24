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
    user_id:"",
    avatar : "",
    name: "",
    info: "",
    address: "",
    sex: "",
    age: "",
    code: "",
    love: "",
    fans: "",
    atten: "",
    userinfoid:"",
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
    fansShow: "",
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userid = app.d.userId;
    var id = options.id
    //用户发布图片的總數
    wx.request({
      url: app.d.ceshiUrl + '/Api/Userinfo/searchpcount',
      method: 'POST',
      data: { id: id },
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
    //用户发布视频的總數
    wx.request({
      url: app.d.ceshiUrl + '/Api/Userinfo/searchvcount',
      method: 'POST',
      data: { id: id },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var nav = that.data.navbar;
        nav[2].num = res.data;
        that.setData({
          navbar: nav
        })
      }
    })
    
    //用戶收藏的總數
    wx.request({
      url: app.d.ceshiUrl + '/Api/Userinfo/searchfcount',
      method: 'POST',
      data: { id: id },
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
    //用户所有信息和他发布的所有作品
    wx.request({
      url: app.d.ceshiUrl + '/Api/Userinfo/searchinfo',
      method: 'POST',
      data: { userid: userid,id:id },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var user = res.data;
        //用戶標籤
        wx.request({
          url: app.d.ceshiUrl + '/Api/Userinfo/sreachlabellimit',
          method: 'POST',
          data: { id: id },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.setData({
              labelArr: res.data,
            })
          }
        })
        //是否关注
        wx.request({
          url: app.d.ceshiUrl + '/Api/Userinfo/fansShow',
          method: 'POST',
          data: { id: id, userid: userid },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //console.log(res.data);
            if(res.data){
              that.data.fansShow = true;
            }else{
              that.data.fansShow = false;
            }
            that.setData({
              fansShow: that.data.fansShow
            })
          }
        })
        //用户的粉丝数量
        wx.request({
          url: app.d.ceshiUrl + '/Api/Userinfo/fansCount',
          method: 'POST',
          data: { id: id},
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.setData({
              fans: res.data
            })
          }
        })
        //用户关注数量
        wx.request({
          url: app.d.ceshiUrl + '/Api/Userinfo/attenCount',
          method: 'POST',
          data: { id: id },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.setData({
              atten: res.data
            })
          }
        })
        //用戶收藏
        wx.request({
          url: app.d.ceshiUrl + '/Api/Userinfo/sreachfavorite',
          method: 'POST',
          data: { id: id,userid :userid },
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
                num:user[i].num
              })
            }
            that.setData({
              collectArr: collectArr
            })
          }
        })
       
        //遍历用户发布的所有图片
        var photoArr = [];
        for (var i in user.thumbnail) {
          var src = [];
          if (user.thumbnail[i].length == 1) {
            src.push(user.thumbnail[i][0])
          } else {
            for (var j in user.thumbnail[i]) {
              src.push(user.thumbnail[i][j])
            }
          }
          photoArr.push({
            src: src
          })
        }
        
      //遍历用户发布的所有视频
        wx.request({
          url: app.d.ceshiUrl + '/Api/Userinfo/video',
          method: 'POST',
          data: { id: id },
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
        if(user == ''){
          wx.showToast({
            title: "账号异常",
            duration: 2000,
            icon:'none'
          });
          setTimeout(function () {
            wx.reLaunch({
              url: "/pages/index/index"
            })
          }, 1000)
          return false;
        }else{
          that.setData({
            userinfoid: user.user_id,
            name: user.user_nickname,
            avatar: user.avatar,
            age: user.age,
            love: user.receive_like_counts,
            address: user.user_city,
            info: user.user_info,
            code: user.wx_code,
            photoArr: photoArr,
          })
          that.setData({
            userinfoid: that.data.userinfoid
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
            sex: that.data.sex
          })
        }
      },
      fail: function (res) {

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
    var to_userid = that.data.userinfoid; //他
    var userid = app.d.userId;  //粉丝
    //console.log(fansShow);
    if (that.data.fansShow == false) {
      if (userid == to_userid){
        wx.showToast({
          title: '您不能关注自己',
          icon: 'none',
          duration: 500
        })
        return false;
      }
      that.data.fansShow = true;
      wx.request({
        url: app.d.ceshiUrl + '/Api/Concern/searchCon',
        method: 'POST',
        data: {
          userid:userid,
          to_userid: to_userid,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success:function(res){
          console.log(res.data);
          if (res.data) {
            wx.showToast({
              title: res.data.msg,
              duration: 2000
            });
          }
        }
      })
    } else {
      that.data.fansShow = false;
    }
    that.setData({
      fansShow: that.data.fansShow
    })
  },
  cancleAtten(e) {
    var that = this;
    var to_userid = that.data.userinfoid; //他
    var userid = app.d.userId;  //粉丝
    var fansShow = that.data.fansShow;
    if (that.data.fansShow == true) {
      if (userid == to_userid) {
        wx.showToast({
          title: '您不能关注自己',
          icon: 'none',
          duration: 500
        })
        return false;
      }
      that.data.fansShow = false
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
          console.log(res.data);
          if (res.data) {
            wx.showToast({
              title: res.data.msg,
              duration: 2000
            });
          }
        }
      })
    } else {
      that.data.fansShow = true
    }
    that.setData({
      fansShow: that.data.fansShow
    })
  },
  toFans(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/userfans/userfans?id=' + id,
    }) 
  },
  toAtten(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/useratten/useratten?id=' + id,
    })
  },
  previewImg(e) {
    var id = e.currentTarget.dataset.id;
    var picList = [];
    for (var i = 0; i < this.data.photoArr[id].src.length; i++) {
      picList.push(this.data.photoArr[id].src[i]);
    }
    //console.log("这是图片"+picList)
    wx.previewImage({
      current: this.data.photoArr[id].src, // 当前显示图片的http链接
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
  }
})
