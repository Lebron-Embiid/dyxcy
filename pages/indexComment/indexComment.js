// pages/indexComment/indexComment.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    comment_count:'',
    to_userid:0,
    commentArr: [],
    reviewStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var id = options.id;
    var to_userid = options.to_userid;
    var userid = app.d.userId;
    that.setData({
      id:id,
      to_userid: to_userid
    })
    that.comment();
  },
  /**
   * 提交评论
   */
  submit:function(e){
    var that = this;
    var id = that.data.id;
    var to_userid = that.data.to_userid;  //视频发布者id
    var userid = app.d.userId;
    var comment = e.detail.value.comment;
    if (comment.length==0){
      wx.showToast({
        title: "评论内容为空",
        duration: 2000,
        icon:'none'
      });
      that.setData({
        comment: ""
      });
      return false;
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Comment/info',
      method: 'POST',
      data: { "id": id, "userid": userid, "comment": comment, "to_userid": to_userid},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        wx.showToast({
          title: res.data.msg,
          duration: 1000,
        });
        that.comment();
        that.setData({
          comment:""
        })
      }
    })
  },

 /**
 * 评论
 */
 comment:function(){
   var that = this;
   var id = that.data.id;
   var to_userid = that.data.to_userid;
   var userid = app.d.userId;
   wx.request({
     url: app.d.ceshiUrl + '/Api/Comment/index',
     method: 'post',
     data: { userid: userid, id: id },
     header: {
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     success: function (res) {
       var res = res.data;
       var commentArr = [];
       for (var i in res) {
         commentArr.push({
           comment_id: res[i].comment_id,
           headImg: res[i].avatar,
           name: res[i].user_nickname,
           content: res[i].content,
           like: res[i].like_count,
           user_id: res[i].user_id,
           show: res[i].isshow,
         })
       }
       that.setData({
         commentArr: commentArr,
       })
       //评论总数
       wx.request({
         url: app.d.ceshiUrl + '/Api/Comment/count',
         method: 'POST',
         data: { id: id },
         header: {
           'Content-Type': 'application/x-www-form-urlencoded'
         },
         success: function (res) {
           that.setData({
             comment_count: res.data
           })
         }
       })
     },
   })
 },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  reset:function(){
    this.setData({
      reviewStatus: false,
      comment: "",
    })
  },
  changeReviewStatus: function (e) {
    this.setData({
      reviewStatus: true,
    })
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
   * 给评论点赞
   */
  addLike(e){
    var that = this;
    var userid = app.d.userId;  //点赞者id
    var to_userid = e.currentTarget.dataset.to_userid; //评论作者id
    var comment_id = e.currentTarget.dataset.comment_id; //评论id
    var idx = e.currentTarget.dataset.idx;
    var arr = that.data.commentArr;
    var isshow = [];
    for(var i in arr){
      isshow.push(arr[i].show);
    }
    var arid = that.data.id;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Comment/addLike',
      method: 'POST',
      data: { userid: userid, to_userid: to_userid, comment_id: comment_id, isshow: isshow[idx],arid:arid},
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
        wx.showToast({
          title: res.data.msg,
          duration: 2000
        });

        if (isshow[idx] == 0){
          isshow[idx] = 1;
          that.data.commentArr[idx].like++;
        }else{
          isshow[idx] = 0;
          that.data.commentArr[idx].like--;
        }
        that.data.commentArr[idx].show = isshow[idx];
        that.setData({
          commentArr: that.data.commentArr
        })
      }
    })
  },
  toUser:function(e){
    var id = e.currentTarget.dataset.id;
    var userid = app.d.userId;
    if (id == userid) {
      wx.reLaunch({
        url: '/pages/person/person',
      })
    } else {
      wx.navigateTo({
        url: '/pages/userinfo/userinfo?id=' + id,
      })
    }
  }
})