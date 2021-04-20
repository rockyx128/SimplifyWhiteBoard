function _createLayer(className) {
  let layerStyle = 'position:absolute;top:0;left:0;transform-origin:0% 0%;'
  let layer = document.createElement('div')
  layer.className = className
  layer.style.cssText = layerStyle
  return layer
}

function createLayer(type = 'layer', svg) {
  if (type === 'svg') {
    return svg.append('g')
  } else {
    return _createLayer(type)
  }
}

class Layer {
  // 我们这个 Layer 以 layers 为蓝本进行创建
  constructor(index, layers) {
    if (!layers) {
      layers = document.querySelector('.layers')
    }
    if (!layers) return
    if (!Layer.maxIndex) Layer.maxIndex = 0
    this.node = createLayer()
    if (!isNaN(index)) {
      // index 就是最上面, 也就是最后一个
      Layer.maxIndex = Math.max(Layer.maxIndex, index)
      this.index = index
    } else {
      this.index = ++Layer.maxIndex
    }
    this.layers = layers
    layers.appendChild(this.node)
  }
  set index(i) {
    this.node.style['z-index'] = i
  }
}
