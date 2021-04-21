class SWBoard {
  constructor() {
    // 生成背景 并加入
    this.initSvgBG()

    // 生成图层 3个,并绑定
    this.initLayers()

    // 生成 内置的 toolbar,并编写功能
    this.initToolbarBuiltin()

    // 加入缩放
    this.onZoom()

    // 加入 resize
    this.onResize()
  }

  initLayers() {
    this.svgLayer = createLayer('svg', this.bg.svg)
    let layers = createLayer('layers')
    let rLayer = createLayer('rLayers')
    this.layers = d3.select(layers)
    this.rLayer = d3.select(rLayer)
    document.body.appendChild(layers)
    document.body.appendChild(rLayer)
  }
  initSvgBG() {
    let r = Math.floor(dpr)
    this.bg = new SvgBG(this, 20 * r)
  }
  initToolbarBuiltin() {
    this.buildinToolbar = new Toolbar(buildinToolbarData)
  }
  onZoom() {
    const zoom = d3
      .zoom()
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ])
      .scaleExtent([0.25, 6])
      .on('zoom', (e) => {
        let { xAxs, yAxs, xScale, yScale, xAxis, yAxis, unit } = this.bg
        let { x, y, k } = e.transform
        // console.log(e.transform, 'realPading', unit * e.transform.k)
        let newXScale = e.transform.rescaleX(xScale)
        let newYScale = e.transform.rescaleY(yScale)

        xAxs.call(xAxis.scale(newXScale))
        yAxs.call(yAxis.scale(newYScale))
        this.svgLayer.attr('transform', e.transform)
        this.layers.style('transform', `translate(${x}px,${y}px) scale(${k})`)

        // if (groups.length) {
        //   groups.forEach((g) => {
        //     g.__moveable.updateRect()
        //   })
        // }

        d3.selectAll('g.tick')
          .filter((d) => approximatelyEqual(d % ((5 * unit) / this.scale), 0))
          .select('line')
          .attr('class', 'dark')

        d3.selectAll('g.tick')
          .filter((d) => !approximatelyEqual(d % ((5 * unit) / this.scale), 0))
          // .filter((d) => d % ((5 * unit) / editor.bg.scale) !== 0)
          .select('line')
          .attr('class', '')

        // d3.selectAll('g.tick').filter((d) => {
        //   // console.log(d)
        //   // (d) => d % (5 * unit * scale) !== 0
        // })

        d3.selectAll('g.tick')
          // .filter((d) => d % ((5 * unit) / editor.bg.scale) !== 0)
          .filter((d) => !approximatelyEqual(d % ((5 * unit) / this.scale), 0))
          .select('text')
          .style('opacity', 0)

        d3.selectAll('g.tick')
          // .filter((d) => d % ((5 * unit) / editor.bg.scale) === 0)
          .filter((d) => approximatelyEqual(d % ((5 * unit) / this.scale), 0))
          .select('text')
          .style('opacity', 0.5)
      })
    // .filter((e) => {
    //   // if (e.type === 'dblclick') return false
    //   // if (editor) {
    //   //   if (editor.mode === 'select' || editor.mode === 'create') {
    //   //     return e.type !== 'mousedown' && e.type !== 'touchstart'
    //   //   } else {
    //   //     return true
    //   //   }
    //   // }
    // })

    this.bg.svg.call(zoom)
  }

  onResize() {
    const resize = () => {
      console.log('resize')
      let { svg, xScale, xAxis, yScale, yAxis, xAxs, yAxs, unit } = this.bg
      svg.attr('width', innerWidth).attr('height', innerHeight)
      console.log(svg.node())
      xScale = d3.scaleLinear().domain([0, innerWidth]).range([0, innerWidth])
      xAxis = d3
        .axisBottom(xScale)
        .ticks(Math.floor(innerWidth / unit))
        .tickSize(2 * innerHeight)
        .tickPadding(8 - 2 * innerHeight)

      yScale = d3.scaleLinear().domain([0, innerHeight]).range([0, innerHeight])

      yAxis = d3
        .axisRight(yScale)
        .ticks(Math.floor(innerHeight / unit))
        .tickSize(2 * innerWidth)
        .tickPadding(8 - 2 * innerWidth)

      yAxs.call(yAxis)
      xAxs.call(xAxis)
      d3.selectAll('g.tick')
        // .filter((d) => d % (5 * unit) === 0)
        .filter((d) => approximatelyEqual(d % (5 * unit), 0))
        .select('line')
        .attr('class', 'dark')

      d3.selectAll('g.tick')
        // .filter((d) => d % (5 * unit) !== 0)
        .filter((d) => !approximatelyEqual(d % (5 * unit), 0))
        .select('text')
        .style('opacity', 0)
    }

    window.onresize = resize
    // window.addEventListener(
    //   'orientationchange',
    //   function () {
    //     console.log('change', innerHeight, innerWidth)
    //     resize()
    //   },
    //   false
    // )
  }

  get zoomTransform() {
    return d3.zoomTransform(this.bg.svg.node())
  }

  get scale() {
    let { k } = this.zoomTransform
    if (k < 2 && k > 0.5) {
      return 1
    } else if (k >= 2 && k < 4) {
      return 2
    } else if (k >= 4 && k < 8) {
      return 4
    } else if (k > 0.25 && k <= 0.5) {
      return 0.5
    } else if (k === 0.25) {
      return 0.25
    }
  }
}
