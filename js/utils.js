const approximatelyEqual = (v1, v2, epsilon = 0.001) =>
  Math.abs(v1 - v2) < epsilon

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
