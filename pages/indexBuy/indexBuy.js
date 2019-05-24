// pages/indexBuy/indexBuy.js
const app = getApp(); 
let text_horn='';
let pid='';
let radio_group='';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '', value: '', checked: '', price: "" },
    ],
    indexid:0,
    text_horn:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userid = app.d.userId;
    var pid = options.pid;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Open/index',
      method: 'POST',
      data: { 
        userid: userid,
        limit:3,
        
       },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var res = res.data;
        var items = [];
        for(var i in res){
          items.push({
            id: res[i].id,
            name: res[i].name,
            value: res[i].value,
            price:res[i].amount,
            checked: res[i].checked
          })
        }
        that.setData({
          pid:pid,
          items: items
        })
      }
    })
  },

  text_horn(e) {
    text_horn = e.detail.value
    console.log('text_horn', e.detail.value)
  

    
  },
  radioChange: function (e) {
    var radio_group = e.detail.value
    this.setData({
      radio_group: e.detail.value
    })
    console.log('45', radio_group)
  },
  /**
   * 支付购买
   */
  submitBuy:function(e){
    
    console.log(e)
    var that = this;
    var idx = that.data.indexid;
    var pid = e.currentTarget.dataset.pid;
    //var radio_group = e.currentTarget.dataset.value;
   // var idx = that.data.indexid; //索引
    var items = that.data.items;
    var amount = items[idx].price; //商品价格
    var name = items[idx].name; //商品名称
    var userid = app.d.userId;  //购买用户
    // console.log(idx)
    // console.log(radio_group)
    //调用支付接口

    if (text_horn == 0) {
      wx.showToast({
        title: "喇叭标题不可为空",
        duration: 2000,
        icon: 'none'
      });
      return false;
    }
    
    if (text_horn){
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/addPost',
      method: 'POST',
      data: {
        userid: userid,
        pid: pid,
        amount: amount,
        text_horn: text_horn,
        radio_group: idx
      },
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
            if (res.errMsg == 'requestPayment:ok'){
              wx.showToast({
                title: '支付成功!',
                duration: 2000,
                icon: 'none'
              });
              wx.navigateTo({
                url: '/pages/index/index'
              });
              return false;
            }
          }
        })
      }
    })
    }else{
      wx.showToast({
        title: '喇叭标题不能为空',
        icon: 'false',
        duration: 2000
      })
    }
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
  back(e) {
    wx.navigateBack({
      delta: 1
    })
  },
  radioChange(e){
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    if (e.detail.value == 1){
      e.detail.value = 0
    } else if (e.detail.value == 2){
      e.detail.value = 1
    } else if (e.detail.value == 3){
      e.detail.value = 2
    }
    this.setData({
      indexid: e.detail.value
    })
    console.log(this.data.indexid);
  },
  radioSelect(e){
    var idx = e.currentTarget.dataset.id;
    var that = this;
    for (var i in that.data.items){
      that.data.items[i].checked = false;
    }
    that.data.items[idx].checked = true;
    that.setData({
      items: that.data.items
    })
  }
})