// 近似相等
const approximatelyEqual = (v1, v2, epsilon = 0.001) =>
  Math.abs(v1 - v2) < epsilon

// 生成 和 设置 transform
function trans(el, transObj) {
  if (!arguments.length) return
  if (!transObj) {
    let style = getComputedStyle(el)
    let t = style.transform
    if (t === 'none') {
      return {
        translate: [0, 0],
        rotate: 0,
        scale: [1, 1],
        skewX: 0,
      }
    } else {
      return matrix2transform(trans2matrix(t))
    }
  } else {
    if (transObj && typeof transObj === 'object') {
      if (el instanceof HTMLElement) {
        el.style.transform = trans2string(transObj)
      } else if (el instanceof SVGElement) {
        el.setAttribute('transform', trans2string(transObj, 'svg'))
      }
    }
  }

  function trans2matrix(tran) {
    let arr = tran.slice(7, -1).split(',')
    return {
      a: parseFloat(arr[0]),
      b: parseFloat(arr[1]),
      c: parseFloat(arr[2]),
      d: parseFloat(arr[3]),
      e: parseFloat(arr[4]),
      f: parseFloat(arr[5]),
    }
  }
  // 求点积
  function transDot(a, b) {
    return a[0] * b[0] + a[1] * b[1]
  }
  // normalize 化
  function transNormalize(a) {
    let k = Math.sqrt(transDot(a, a))
    a[0] /= k
    a[1] /= k
    return k
  }

  function transCombine(a, b, k) {
    a[0] += k * b[0]
    a[1] += k * b[1]
    return a
  }

  function matrix2transform(m) {
    const degrees = 180 / Math.PI
    let r0 = [m.a, m.b],
      r1 = [m.c, m.d],
      kx = transNormalize(r0)
    kz = transDot(r0, r1)
    ky = transNormalize(transCombine(r1, r0, -kz))
    return {
      translate: [m.e, m.f],
      rotate: Math.atan2(m.b, m.a) * degrees,
      scale: [kx, ky],
      skewX: (kz / ky) * degrees,
    }
  }

  function trans2string(transObj, type) {
    let transform = ''
    if (type === 'svg') {
      // 不带 单位
      for (let k in transObj) {
        if (k === 'translate') {
          transform += `translate(${
            transObj[k][0] === 0 ? 0 : transObj[k][0]
          },${transObj[k][1] === 0 ? 0 : transObj[k][1]}) `
        } else if (k === 'rotate' || k === 'skewX') {
          transform += `${k}(${transObj[k]}) `
        } else if (k === 'scale') {
          transform += `${k}(${transObj[k]}) `
        }
      }
    } else {
      for (let k in transObj) {
        if (k === 'translate') {
          transform += `translate(${
            transObj[k][0] === 0 ? 0 : transObj[k][0] + 'px'
          },${transObj[k][1] === 0 ? 0 : transObj[k][1] + 'px'}) `
        } else if (k === 'rotate' || k === 'skewX') {
          transform += `${k}(${transObj[k]}deg) `
        } else if (k === 'scale') {
          transform += `${k}(${transObj[k]}) `
        }
      }
    }

    return transform.trim()
  }
}

// 创建 dom
function createDom({
  styles,
  className,
  id,
  text,
  html,
  tagName = 'div',
  parent,
  attrs,
} = {}) {
  const el = document.createElement(tagName)
  if (isString(id)) el.id = id
  // className 方式是 'abc bc cc'
  if (isString(className)) el.className = className
  // styles格式,就是css的写法格式
  // width:100px;height:100px;position:absolute;
  if (isString(styles)) el.style.cssText = styles
  if (isString(text)) el.innerText = text
  if (isString(html)) el.innerHTML = html
  if (isObject(attrs)) {
    for (let attr in attrs) {
      el.setAttribute(attr, attrs[attr])
    }
  }
  if (isElement(parent)) parent.appendChild(el)

  return el
}

// 判断函数
function isElement(el) {
  return el && /Element$/.test(Object.prototype.toString.call(el).slice(8, -1))
}

function isString(str) {
  return str && typeof str === 'string'
}

function isObject(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1) === 'Object'
}

// 这里我们不收集 body, html , Window , 因为这三个对于我们没啥用
function getElPath(el) {
  let arr = [el]
  while (el.parentElement && el !== document.body) {
    arr.push(el)
    el = parentElement
  }
  return arr
}

// 从 parent 中找符合要求的 元素 , 没有就返回 false
function findTargetFromParent(target, condition) {
  while (target !== document.body) {
    if (condition(target)) {
      return target
    }
    target = target.parentElement
  }
  return false
}

// solo
function soleElement({ elements, condition, matchfn, unMatchfn }) {
  for (let i = 0, l = elements.length; i < l; i++) {
    let el = elements[i]
    if (condition(el)) {
      console.log('matched', el)
      matchfn(el)
    } else {
      console.log('unmatched', el)
      unMatchfn(el)
    }
  }
}

// muti
function mutiElement(elements, condition, matchfn) {
  for (let i = 0, l = elements.length; i < l; i++) {
    let el = elements[i]
    if (condition(el)) {
      matchfn(el)
    }
  }
}

// cancel select
function onOff(flag) {
  // 设置初始状态
  return function (onfn, offfn) {
    // 开关的状态设置为 关
    // 后续效果就是 关灯效果 , off
    flag = !flag
    if (flag) {
      offfn()
    } else {
      onfn()
    }
  }
}

function dragInRange(rect, range) {
  let { x, y, width, height } = rect
  let lx, ly
  if (x < range.x) {
    lx = range.x
  } else if (x + width > range.x + range.width) {
    lx = range.x + range.width - width
  } else {
    lx = x
  }
  if (y < range.y) {
    ly = range.y
  } else if (y + height > range.y + range.height) {
    ly = range.y + range.height - height
  } else {
    ly = y
  }
  return [lx, ly]
}

// 我们知道nodelist 没法使用 forEach ,我们就自己写一个 forEach 吧
function forEach(nodelist, fn) {
  if (nodelist.length) {
    for (let i = 0, l = nodelist.length; i < l; i++) {
      fn(nodelist[i], i)
    }
  }
}
