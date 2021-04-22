class ColorPanel extends Panel {
  constructor({ dragable = true, parent = document.body } = {}) {
    super({ dragable })
    console.log(this)
    this.node.style.width = 200 * Math.floor(dpr) + 'px'
    this.header.style.height = 20 * Math.floor(dpr) + 'px'
    // this.body.style.height = '400px'
    this.body.style.padding = '10px'
    let cp = createDom({
      className: 'color-picker',
      parent: this.body,
    })
    parent.appendChild(this.node)
    const pickr = Pickr.create({
      el: '.color-picker',
      theme: 'nano', // or 'monolith', or 'nano'
      components: {
        // Main components
        preview: true,
        opacity: true,
        hue: true,
        lightness: true,

        // Input / output Options
        interaction: {
          hex: true,
          rgba: true,
          hsla: true,
          input: true,
        },
      },
    })
    pickr.on('change', (color, slider, pickr1) => {
      pickr1._root.button.style.color = color.toRGBA()

      console.log(pickr)
    })
  }
}
