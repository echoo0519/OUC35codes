Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:'../images/logo.png',
    name:'Hello World'
  },
  getMyInfo: function () {
    wx.getUserProfile({
      // 必须填写！说明获取信息的用途（微信强制要求）
      desc: "用于展示你的头像和昵称",        
      success: (res) => {
        // 更新页面数据：替换为用户真实信息
        this.setData({
          src: res.userInfo.avatarUrl, 
          name: res.userInfo.nickName   
        });
      },
      fail: (err) => {
        console.log("获取用户信息失败：", err); 
      }
    });
  }
})