export default class Planet {
  static genColor() {
    return `#${ ((1<<24)*Math.random()|0).toString(16) }`;
  }
  
  constructor({
    color,
    parentEl,
    radius = 0,
    x = 0,
    y = 0,
  } = {}) {
    this.color = color || Planet.genColor();
    
    this.planet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.planet.setAttributeNS(null, 'cx', x);
    this.planet.setAttributeNS(null, 'cy', y);
    this.planet.setAttributeNS(null, 'r', radius);
    this.planet.setAttributeNS(null, 'fill', this.color);
    this.planet.setAttributeNS(null, 'stroke', 'none');
    
    parentEl.appendChild(this.planet);
  }
  
  setRadius(radius) {
    this.planet.setAttributeNS(null, 'r', radius);
  }
}