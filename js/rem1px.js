const dpr = window.devicePixelRatio

document.querySelector('html').style.fontSize = 1 * dpr + 'px'
document.body.style.display = 'block'

if (dpr === 1) {
  let shaperending = document.createElement('style')

  shaperending.textContent = `.axis line {shape-rendering: crispEdges;}`

  document.head.appendChild(shaperending)
}
