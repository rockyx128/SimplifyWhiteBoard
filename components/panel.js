class Panel {
  constructor({ editor, dragable = false } = {}) {
    /*
    <div class="panel">
     // header 可以执行拖拽
      <div class="pheader"></div>
      <div class="pbody"></div>
    </div>
    这是一个非常经典的结构, 以后我们会经常用
    */
    let panel = createDom({
      className: 'panel__',
    })

    let header = createDom({
      className: 'pheader__',
      parent: panel,
    })

    let body = createDom({
      className: 'pbody__',
      parent: panel,
    })

    this.node = panel
    this.header = header
    this.body = body
    this.editor = editor
    if (dragable) {
      this.ondrag(header)
    }
  }

  ondrag(header) {
    let sX,
      sY,
      dX,
      dY,
      dragFlag = false,
      target,
      rect,
      range,
      lx,
      ly,
      rectX,
      rectY
    const dragEvent = d3
      .drag()
      .on('start', dragStart)
      .on('drag', drag)
      .on('end', dragEnd)

    function dragStart(e) {
      target = e.sourceEvent.target.parentElement
      if (!target.__trans) target.__trans = trans(target)
      console.log(target.__trans.translate)
      dragFlag = true
      let [x, y] = d3.pointers(e, document.body)[0]
      dX = 0
      dY = 0
      sX = x
      sY = y
      rect = target.getBoundingClientRect()
      // 本来的位置
      rectX = rect.x - target.__trans.translate[0]
      rectY = rect.y - target.__trans.translate[1]
      range = { x: 0, y: 0, width: innerWidth, height: innerHeight }
    }

    function drag(e) {
      if (!dragFlag) return
      let [x, y] = d3.pointers(e, document.body)[0]
      dX = x - sX
      dY = y - sY
      let [tX, tY] = target.__trans.translate
      // 现在的位置
      rect.x = rectX + tX + dX
      rect.y = rectY + tY + dY
      ;[lx, ly] = dragInRange(rect, range)
      target.style.transform = `translate(${lx - rectX}px,${ly - rectY}px)`
    }

    function dragEnd(e) {
      if (!dragFlag) return
      target.__trans.translate = [lx - rectX, ly - rectY]
      console.log(target.__trans.translate)
      dragFlag = false
      target = null
      dX = 0
      dY = 0
    }

    d3.select(header).call(dragEvent)
  }
}
