// pages/game/game.js
var data = require('../../utils/data.js')
// 地图数组
var map = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0]
]
// 箱子数组
var box = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0]
]
// 方块的宽度
var w = 40
// 初始化游戏主角(小鸟)的行与列
var row = 0
var col = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    level:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options) {
    let level=options.level
    this.setData({
      level:parseInt(level)+1
    })

    this.ctx=wx.createCanvasContext('myCanvas')
    this.initMap(level)
    this.drawCanvas()

  },

  initMap: function(level) {
    let mapData = data.maps[level]
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        box[i][j] = 0
        map[i][j] = mapData[i][j]
        if (mapData[i][j] == 4) {
          box[i][j] = 4
          map[i][j] = 2
        } else if (mapData[i][j] == 5) {
          map[i][j] = 2
          row = i
          col = j
        }
      }
    }
  },

  drawCanvas:function() {
    let ctx = this.ctx
    //清空画布
    ctx.clearRect(0, 0, 320, 320)
    //使用双重 for 循环绘制 8x8 的地图
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        //默认是道路
        let img = 'ice'
        if (map[i][j] == 1) {
          img = 'stone'
        } else if (map[i][j] == 3) {
          img = 'pig'
        }
        //绘制地图
        ctx.drawImage('/images/icons/' + img + '.png', j * w, i * w, w, w)
        if (box[i][j] == 4) {
          //叠加绘制箱子
          ctx.drawImage('/images/icons/box.png', j * w, i * w, w, w)
        }
      }
    }
    //叠加绘制小鸟
    ctx.drawImage('/images/icons/bird.png', col * w, row * w, w, w)
    ctx.draw()
  },

  up: function() {
    if (row > 0) {
      if (map[row - 1][col] != 1 && box[row - 1][col] != 4) {
        row = row - 1
      } else if (box[row - 1][col] == 4) {
        if (row - 1 > 0) {
          if (map[row - 2][col] != 1 && box[row - 2][col] != 4) {
            box[row - 2][col] = 4
            box[row - 1][col] = 0
            row = row - 1
          }
        }
      }
      this.drawCanvas()
      this.checkWin()
    }
  },
  down: function() {
    //不在最底端才考虑下移
    if (row < 7) {
      //如果下方不是墙或箱子,可以移动小鸟
      if (map[row + 1][col] != 1 && box[row + 1][col] != 4) {
        //更新当前小鸟的坐标
        row = row + 1
      }
      //如果下方是箱子
      else if (box[row + 1][col] == 4) {
        //箱子不在最底端才能考虑推动
        if (row + 1 < 7) {
          //如果箱子下方不是墙或箱子
          if (map[row + 2][col] != 1 && box[row + 2][col] != 4) {
            box[row + 2][col] = 4
            box[row + 1][col] = 0
            //更新当前小鸟的坐标
            row = row + 1
          }
        }
        //重新绘制地图
        this.drawCanvas()
        this.checkWin()
      }
    }
  },
  left: function() {
    //不在最左侧才考虑左移
    if (col > 0) {
      //如果左侧不是墙或箱子,可以移动小鸟
      if (map[row][col - 1] != 1 && box[row][col - 1] != 4) {
        //更新当前小鸟的坐标
        col = col - 1
      }
      //如果左侧是箱子
      else if (box[row][col - 1] == 4) {
        //箱子不在最左侧才能考虑推动
        if (col - 1 > 0) {
          //如果箱子左侧不是墙或箱子
          if (map[row][col - 2] != 1 && box[row][col - 2] != 4) {
            box[row][col - 2] = 4
            box[row][col - 1] = 0
            //更新当前小鸟的坐标
            col = col - 1
          }
        }
      }
      //重新绘制地图
      this.drawCanvas()
      this.checkWin()
    }
  },
  right: function() {
    //不在最右侧才考虑右移
    if (col < 7) {
      //如果右侧不是墙或箱子,可以移动小鸟
      if (map[row][col + 1] != 1 && box[row][col + 1] != 4) {
        //更新当前小鸟的坐标
        col = col + 1
      }
      //如果右侧是箱子
      else if (box[row][col + 1] == 4) {
        //箱子不在最右侧才能考虑推动
        if (col + 1 < 7) {
          //如果箱子右侧不是墙或箱子
          if (map[row][col + 2] != 1 && box[row][col + 2] != 4) {
            box[row][col + 2] = 4
            box[row][col + 1] = 0
            //更新当前小鸟的坐标
            col = col + 1
          }
        }
      }
      //重新绘制地图
      this.drawCanvas()
      //检查游戏是否成功
      this.checkWin()
    }
  },

  isWin: function() {
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if (box[i][j] == 4 && map[i][j] != 3) {
          return false
        }
      }
    }
    return true
  },
  checkWin: function() {
    if (this.isWin()) {
      wx.showModal({
        title: '恭喜',
        content: '游戏成功！',
        showCancel: false
      })
    }
  },

  restartGame: function() {
    this.initMap(this.data.level - 1)
    this.drawCanvas()
  }
})