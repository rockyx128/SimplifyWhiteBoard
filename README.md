# SimplifyWhiteBoard
简约白板 , 创意无限



## 用到的库

## 开发难点

### 1px 像素问题

由于我们采用的是无边界的背景 , 所以

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

对于我们来讲意义不大 , 我们采用禁止缩放来代替

```html
<meta user-scalable="no" />
```

这样做的好处就是 1px 就彻底是 1px 了, 非常精细, 但是问题也随之也来了

`devicePixelRatio` 设备像素比的问题

就是说比如我的手机 devicePixelRatio 是非常不好意思的 2.75 , 就是说 , 我电脑屏幕上的正常大小 , 在手机屏幕上就缩小了 2.75 倍 , 这时候就很难受了 , 能解决吗 ? 可以解决

对! 利用REM 

```js
// 为了防止出现意想不到的 bug , 我们先隐藏网页,
// <body style="display:none;font-size:16rem;'></body>
// 我们根据 dpr 设置 html 元素 font-size, 如下

const dpr = window.devicePixelRatio

document.querySelector('html').style.fontSize = 1 * dpr + 'px'

// 以前我们写 1px 的地方,
// 现在我们写为 1rem 是不是非常方便呢

// 当我们需要 1px 像素的时候,我们就写为 1px, 这就是绝对精细的 1px 了

// 当然副作用也是有的, 但是可以接受
// 副作用1, 有些字体会出现模糊 毕竟 dpr 1.25,1.75 2.75 ,这样的情况很多
// 副作用2, 性能会差那么一丢丢, 因为每一个几乎每一个元素都要进行一个 rem -> px -> 近似整数的计算

// 可以实现我们的也许需求 ,而且还是 PC 移动端双支持 , 那还要什么自行车呢? 

// 设置好之后渲染
document.body.style.display='block'

```

### 横屏竖屏切换问题

获取 innerWidth / innerHeight 在竖屏的时候正常 比如 w × h = 980 × 1743

回到横屏 innerWidth / innerHeight 数值有问题,  w 还是 980 , h 变为 552 我直接晕了

不应该啊, 到底是哪里的问题

