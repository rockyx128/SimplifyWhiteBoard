class SvgBG {
  constructor(editor, unit) {
    // 设置背景 svg 元素
    let svg = d3
      .select(document.body)
      .append('svg')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .style('cursor', 'move')
      .style('position', 'absolute')
      .style('top', 0)
      .style('left', 0)

    this.svg = svg
    this.unit = unit

    // 建立相互引用的关系
    this.editor = editor

    // 加入坐标系
    let xScale = d3.scaleLinear().domain([0, innerWidth]).range([0, innerWidth])
    let xAxis = d3
      .axisBottom(xScale)
      .ticks(Math.floor(innerWidth / unit))
      .tickSize(2 * innerHeight)
      .tickPadding(8 - 2 * innerHeight)
    let yScale = d3
      .scaleLinear()
      .domain([0, innerHeight])
      .range([0, innerHeight])

    let yAxis = d3
      .axisRight(yScale)
      .ticks(Math.floor(innerHeight / unit))
      .tickSize(2 * innerWidth)
      .tickPadding(8 - 2 * innerWidth)

    let gY = svg.append('g').attr('class', 'axis y').call(yAxis)
    let gX = svg.append('g').attr('class', 'axis x').call(xAxis)

    this.xScale = xScale
    this.yScale = yScale
    this.xAxis = xAxis
    this.yAxis = yAxis
    this.xAxs = gX
    this.yAxs = gY
    d3.selectAll('g.tick')
      .filter((d) => d % (5 * unit) === 0)
      .select('line')
      .attr('class', 'dark')

    d3.selectAll('g.tick')
      .filter((d) => d % (5 * unit) !== 0)
      .select('text')
      .style('opacity', 0)
  }
}
