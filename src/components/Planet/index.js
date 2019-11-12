export default class Planet {
  constructor({
    color = '#CCC',
    parentEl,
    radius = 0,
    x = 0,
    y = 0,
  } = {}) {
    this.planet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.planet.setAttributeNS(null, 'cx', x);
    this.planet.setAttributeNS(null, 'cy', y);
    this.planet.setAttributeNS(null, 'r', radius);
    this.planet.setAttributeNS(null, 'fill', 'url(#radGrad)');
    // this.planet.setAttributeNS(null, 'fill', color);
    this.planet.setAttributeNS(null, 'stroke', 'none');
    
    parentEl.appendChild(this.planet);
  }
  
  setRadius(radius) {
    this.planet.setAttributeNS(null, 'r', radius);
  }
}