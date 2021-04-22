const dpr = window.devicePixelRatio
const intDpr = Math.floor(dpr)
document.querySelector('html').style.fontSize = 1 * dpr + 'px'
document.body.style.display = 'block'
document.body.style.fontSize = 16 * intDpr + 'px'
let toolUnit = dpr > 1.5 ? 40 : 60

let shaperending = document.createElement('style')
if (dpr === 0) {
  shaperending.textContent = `
  .axis line {shape-rendering: crispEdges;}
  .tool {
    width: ${toolUnit}px;
    height: ${toolUnit}px;
  }
  `
}
document.head.appendChild(shaperending)
