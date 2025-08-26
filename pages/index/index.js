Page({
  /**
   * 页面的初始数据
   */
  data: {
    region: ['安徽省', '芜湖市', '镜湖区'],
    now:{
      tmp: 0,
      cond_txt: '未知',
      cond_code: 999,
      hum: 0,
      pres: 0,
      vis: 0,
      wind_dir: 0,
      wind_spd: 0,
      wind_sc: 0
    }
  },
  /**
   * 更新省、市、区信息
   */
  regionChange: function(e) {
    this.setData({region: e.detail.value});
    this.getWeather(); //更新天气
  },
  /**
   * 生命周期函数 -- 监听页面加载
   */
  onLoad: function(options) {
    this.getWeather(); 
  },
  getWeather: function() {
    var that = this;
    var cityName = that.data.region[1];

    wx.request({
      url: 'https://nv3yfqu3mh.re.qweatherapi.com/geo/v2/city/lookup',
      data: {
        location: cityName,
        key: '10217804a04b44849882569459116687',
        number: 1
      },
      success: function(searchRes) {
        if (searchRes.data && searchRes.data.location && searchRes.data.location.length > 0) {
          var cityId = searchRes.data.location[0].id;
          
          wx.request({
            url: 'https://nv3yfqu3mh.re.qweatherapi.com/v7/weather/now',
            data: {
              location: cityId,
              key: '10217804a04b44849882569459116687'
            },
            success: function(weatherRes) {
              wx.hideLoading();
              if (weatherRes.data && weatherRes.data.now) {
                that.setData({
                  now: weatherRes.data.now
                });
              }
            },
          });
        } 
      },
    });
  },
})