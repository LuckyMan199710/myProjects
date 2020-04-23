/**
 * @file 所有有关绘画业务的工具函数集合
 * @author junhao
 */
// 保存二维码图片
const saveImage = function (name, drawCodeBg, drawMyCode) {
  wx.showLoading({
    title: '保存中...'
  });
  let _this = this;
  let str = name
  let ctx = wx.createCanvasContext('myCanvas');
  ctx.beginPath()
  ctx.drawImage(drawCodeBg, 0, 0, 314, 371)
  ctx.drawImage(drawMyCode, 61, 13, 183, 183)
  // if (drawHeadimg) {
  // 	ctx.drawImage(drawHeadimg, 118, 60, 80, 80)
  // }
  ctx.setFontSize(16)
  ctx.setFillStyle('#333333')

  ctx.fillText(str, (310 - ctx.measureText(str).width) * 0.5, 214);
  ctx.draw(false, function (e) {
    // 保存到本地
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 314,
      height: 371,
      canvasId: 'myCanvas',
      success: function (res) {
        let pic = res.tempFilePath;
        console.log('pic', pic)
        wx.saveImageToPhotosAlbum({
          filePath: pic,
          success(res) {
            wx.hideLoading();
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            });
          },
          fail() {
            wx.hideLoading();
          }
        });
      },

    });
  });
}

// 保存图片
const savePic = function (pic) {
  wx.showLoading({
    title: '保存中...'
  });
  console.log('saveImageToPhotosAlbumsaveImageToPhotosAlbum', pic)

  wx.saveImageToPhotosAlbum({
    filePath: pic,
    success(res) {
      wx.hideLoading()
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      });
    },
    fail() {
      wx.hideLoading();
    }
  })
}



/**
 * @param {ctx} canvas对象
 * @param {x} 绘制图片起始x坐标
 * @param {y} 绘制图片起始y坐标
 * @param {w} 图片的宽度
 * @param {y} 图片的高度
 * @param {r} 图片的圆角半径
 * */
//圆角矩形
const roundRect = function (ctx, x, y, w, h, r, img) {
  // 开始绘制
  ctx.beginPath()
  ctx.drawImage(img, x, y, w, h)
  // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
  ctx.setFillStyle('transparent')
  // ctx.setStrokeStyle('transparent')
  // 绘制左上角圆弧
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
  // 绘制border-top
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.lineTo(x + w, y + r)
  // 绘制右上角圆弧
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

  // 绘制border-right
  ctx.lineTo(x + w, y + h - r)
  ctx.lineTo(x + w - r, y + h)
  // 绘制右下角圆弧
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

  // 绘制border-bottom
  ctx.lineTo(x + r, y + h)
  ctx.lineTo(x, y + h - r)
  // 绘制左下角圆弧
  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

  // 绘制border-left
  ctx.lineTo(x, y + r)
  ctx.lineTo(x + r, y)

  ctx.fill()
  // ctx.stroke()

  // ctx.closePath()
  // 剪切
  ctx.clip()
}

const drawRoundRect = function (ctx, x, y, w, h, r, img) {
  ctx.save()
  if (w < 2 * r) r = w / 2
  if (h < 2 * r) r = h / 2
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath();
  ctx.clip()
  ctx.drawImage(img, x, y, w, h)
  ctx.restore() // 返回上一状态
}

/*
str:要绘制的字符串
canvas:canvas对象
initX:绘制字符串起始x坐标
initY:绘制字符串起始y坐标
lineHeight:字行高，自己定义个值即可
canvasWidth:文本宽度
lines: 行数
fontSize: 字体大小
color: 字体颜色
*/
// (coupon[1], ctx, 10, 40, 40, 1000, 1)
const canvasTextAutoLine = function (str, canvas, initX, initY, lineHeight, canvasWidth, lines, fontSize = 28, color =
  '#000000', align = 'left') {
  var lineWidth = 0;
  var lastSubStrIndex = 0;
  var beginLineHeight = lineHeight;
  var beginY = initY + lineHeight;
  var initY = initY + lineHeight;
  var ctx = canvas;
  if (str) {
    var str = str.toString()
  } else {
    var str = ''
  }
  var textAlign = align
  return new Promise(resolve => {

    canvas.setFontSize(fontSize)
    canvas.setFillStyle(color)
    canvas.textAlign = textAlign;
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      // console.log(lineWidth)
      if (textAlign == 'right') {
        if (lineWidth > canvasWidth - initX && canvasWidth) { //减去initX,防止边界出现的问题
          if (initY >= beginY + beginLineHeight * (lines - 1)) {
            ctx.fillText(str.substring(lastSubStrIndex, i - 1) + '...', initX, initY);
            resolve(canvasWidth - initX)
            return
          } else {
            ctx.fillText(str.substring(lastSubStrIndex, i), initX, initY);
            initY += lineHeight;
            lineWidth = 0;
            lastSubStrIndex = i;
          }
        }
      } else {
        if (lineWidth > canvasWidth - initX && canvasWidth) { //减去initX,防止边界出现的问题
          if (initY >= beginY + beginLineHeight * (lines - 1)) {
            ctx.fillText(str.substring(lastSubStrIndex, i - 1) + '...', initX, initY);
            resolve(canvasWidth)
            return
          } else {
            ctx.fillText(str.substring(lastSubStrIndex, i), initX, initY);
            initY += lineHeight;
            lineWidth = 0;
            lastSubStrIndex = i;
          }
        }
      }

      if (i == str.length - 1) {
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY);
        resolve(ctx.measureText(str).width)
      }
    }
  })
}

// 绘制圆角矩形
/**
 * @param {Object} ctx   canvas对象
 * @param {String} initX 绘制矩形起始x坐标
 * @param {String} initY 绘制矩形起始y坐标
 * @param {String} width 绘制矩形的宽度
 * @param {String} height 绘制矩形的高度
 * @param {String} radius 绘制矩形的圆角半径
 * @param {String} fillStyle 矩形的填充颜色
 * 
 */
const radiusRect = function (ctx, initX, initY, width, height, radius, fillStyle = "#0066CC") {
  // 设置填充颜色
  ctx.fillStyle = fillStyle
  // 绘制边
  ctx.moveTo(initX, initY + radius)
  ctx.lineTo(initX, initY + height - radius)
  // 绘制圆角
  ctx.quadraticCurveTo(initX, initY + height, initX + radius, initY + height)
  ctx.lineTo(initX + width - radius, initY + height)
  ctx.quadraticCurveTo(initX + width, initY + height, initX + width, initY + height - radius)
  ctx.lineTo(initX + width, initY + radius)
  ctx.quadraticCurveTo(initX + width, initY, initX + width - radius, initY)
  ctx.lineTo(initX + radius, initY)
  ctx.quadraticCurveTo(initX, initY, initX, initY + radius)
  ctx.fill()
  console.log('绘制圆角矩形')
  // 闭合路径
  ctx.closePath();
}

// 绘制固定宽高的不变形的图片(保证短边全部显示出来)
/**
 * @param {Object} ctx   canvas对象
 * @param {String} initX 绘制图片起始x坐标
 * @param {String} initY 绘制图片起始y坐标
 * @param {String} width 绘制图片的宽度
 * @param {String} height 绘制图片的高度
 * @param {String} drawImg 绘制图片的url
 * @param {String} scale 原图的宽高比例(宽/高)
 * 
 */

const aspectFillImg = function (ctx, initX, initY, width, height, drawImg, scale) {
  ctx.beginPath()
  ctx.save()
  ctx.rect(initX, initY, width, height)
  ctx.clip()
  if (scale > width / height) { 
    // width大于height => 横向图
    ctx.drawImage(drawImg, initX - (height * scale - width), initY, width * scale, height)
  } else {
    ctx.drawImage(drawImg, initX, initY + (width / scale - height), width, height / scale)
  }
  ctx.restore()
}
// 绘制圆形边框的图片
/**
 * @param {Object} ctx   canvas对象
 * @param {String} initX 绘制图片起始x坐标
 * @param {String} initY 绘制图片起始y坐标
 * @param {String} width 绘制图片的宽度
 * @param {String} height 绘制图片的高度
 * @param {String} drawImg 绘制图片的url
 * 
 */

const circularImg = function (ctx, initX, initY, width, height, drawImg) {
  let r = width / 2
  ctx.save()
  ctx.arc(initX + r, initY + r, r, 0, Math.PI * 2)
  ctx.clip()
  ctx.drawImage(drawImg, initX, initY, width, height)
  ctx.restore()
}



// 预览图片
const getPreviewImage = function (img) {
  wx.previewImage({
    current: img,
    urls: [img]
  })
}

// 处理webp
const filterTag = function (str) {
  if (str) {
    let mapObj = {}
    mapObj['<img'] = '<img style=\"max-width:100%;height:auto;\"'
    mapObj['article>'] = 'div>'
    mapObj['header>'] = 'div>'
    mapObj['footer>'] = 'div>'
    mapObj['section>'] = 'div>'
    mapObj['/strong>'] = '/span>'
    mapObj['<strong'] = '<span class=\"strong\"'
    // 适配webp
    mapObj['&tp=webp'] = ''
    mapObj['tp=webp'] = ''
    mapObj['&wx_lazy=1'] = ''
    // 富文本可选中
    mapObj['<div'] = '<div class=\"user-select\"'
    mapObj['<p'] = '<p class=\"user-select\"'
    mapObj['<span'] = '<span class=\"user-select\"'

    let re = new RegExp(Object.keys(mapObj).join("|"), "gi");

    return str.replace(re, function (matched) {
      return mapObj[matched.toLowerCase()];
    })
  } else {
    return ''
  }
}

// 转发事件
const shareApp = (path, title = "商城", imageUrl = 'https://zanhushop.senwell.cn/images/bbs/wx_share.png') => {
  var that = this;
  wx.showShareMenu({
    withShareTicket: true
  })
  console.log('path:::::::::::', path);
  // if (path.indexOf('?') > 0) {
  // 	path = path + '&from_user_id=' + wx.getStorageSync('self_user_id')
  // } else {
  // 	path = path + '?from_user_id=' + wx.getStorageSync('self_user_id')
  // }
  return {
    title,
    path,
    imageUrl
  }
}



export default {
  saveImage,
  savePic,
  canvasTextAutoLine,
  radiusRect,
  getPreviewImage,
  roundRect,
  drawRoundRect,
  filterTag,
  aspectFillImg,
  shareApp,
  circularImg
}
