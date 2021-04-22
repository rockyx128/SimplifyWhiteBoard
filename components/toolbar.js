class Toolbar extends Panel {
  constructor({
    editor,
    direction,
    n = 1,
    tools,
    name,
    dragable = true,
    unit = 40,
  }) {
    super({ dragable })
    // 这里不光我们可以初始化 toolbar , 给 toobar 配置功能
    // 更要做的是, 做一个 toolbar 的管理器 list
    // 我们要通过一个自定义的渲染得到一个合理的排布, 一个 合理的 Index
    // 我们默认就显示 最常用的 Toolbar
    // 布局是比较简单的, 就是一个 panel 的布局, pheader pbody
    this.unit = unit
    this.editor = editor
    if (tools && tools.length) {
      let len = tools.length
      if (n > len) n = len

      let toolbar = this.node
      toolbar.classList.add('toolbar')
      if (name) toolbar.classList.add(name)

      // let tHeader = this.header

      let tBody = this.body

      tools.forEach((tool) => {
        let t = createDom({
          className: 'tool ' + tool.name,
          html: tool.icon,
          attrs: {
            name: tool.name,
          },
          parent: tBody,
        })
        if (tool.fn && typeof tool.fn === 'function') {
          t.addEventListener('click', (e) => {
            tool.fn(e, editor)
          })
        }
      })
      if (direction === 'hor') {
        tBody.style.cssText = `width:${getN(len, n) * unit}rem;height:${
          n * unit
        }rem;`
        tBody.style['flex-direction'] = 'row'
        this.genGrid(getN(len, n), n)
      } else if (direction === 'ver') {
        tBody.style.cssText = `height:${getN(len, n) * unit}rem;width:${
          n * unit
        }rem;`
        tBody.style['flex-direction'] = 'column'
        this.genGrid(n, getN(len, n))
      }

      tBody.addEventListener('click', (e) => {
        let t = findTargetFromParent(e.target, (t) =>
          t.classList.contains('tool')
        )

        if (!t) return

        soleElement({
          elements: t.parentElement.children,
          condition: (tt) => tt === t,
          matchfn: (el) => {
            if (!el.__active) {
              el.__active = true
              el.classList.add('active')
            } else {
              el.__active = false
              el.classList.remove('active')
            }
          },
          unMatchfn: (el) => {
            el.__active = false
            el.classList.remove('active')
          },
        })
      })
      document.body.appendChild(toolbar)
    }
  }

  genGrid(w, h) {
    if (w > 1) {
      for (let i = 1; i < w; i++) {
        let el = document.createElement('div')
        el.style.position = 'absolute'
        el.style.left = i * this.unit + 'rem'
        el.style.height = h * this.unit + 'rem'
        el.style.width = '1rem'
        el.className = 'toolgrid'
        this.body.appendChild(el)
      }
    }
    if (h > 1) {
      for (let i = 1; i < h; i++) {
        let el = document.createElement('div')
        el.style.position = 'absolute'
        el.style.top = i * this.unit + 'rem'
        el.style.width = w * this.unit + 'rem'
        el.style.height = '1rem'
        el.className = 'toolgrid'
        this.body.appendChild(el)
      }
    }
  }
}
Toolbar.list = []
function getN(len, n) {
  return Math.ceil(len / n)
}
