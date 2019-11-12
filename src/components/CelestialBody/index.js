export default class CelestialBody {
  static genColor() {
    return `#${ ((1<<24)*Math.random()|0).toString(16) }`;
  }
  
  constructor({
    color,
    parentEl,
    radius = 0,
    type = CelestialBody.TYPE__PLANET,
    x = 0,
    y = 0,
  } = {}) {
    this.color = color || CelestialBody.genColor();
    this.id = Date.now();
    this.type = type;
    
    this.celestialBody = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.celestialBody.setAttributeNS(null, 'cx', x);
    this.celestialBody.setAttributeNS(null, 'cy', y);
    this.celestialBody.setAttributeNS(null, 'r', radius);
    this.celestialBody.setAttributeNS(null, 'fill', this.color);
    this.celestialBody.setAttributeNS(null, 'stroke', 'none');
    this.celestialBody.setAttributeNS(null, 'data-id', this.id);
    
    parentEl.appendChild(this.celestialBody);
  }
  
  setRadius(radius) {
    this.celestialBody.setAttributeNS(null, 'r', radius);
  }
}

CelestialBody.TYPE__ASTEROID = 'asteroid';
CelestialBody.TYPE__MOON = 'moon';
CelestialBody.TYPE__PLANET = 'planet';
CelestialBody.TYPE__SUN = 'sun';