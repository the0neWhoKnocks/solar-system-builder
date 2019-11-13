export default class CelestialBody {
  static genColor() {
    return `#${ ('000000' + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6) }`;
  }
  
  constructor({
    color,
    id,
    filter,
    radius = CelestialBody.SIZE__MIN,
    x = 0,
    y = 0,
  } = {}) {
    this.color = color || CelestialBody.genColor();
    this.id = id || Date.now();
    this.radius = radius;
    this.x = x;
    this.y = y;
    
    this.celestialBody = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.celestialBody.setAttributeNS(null, 'cx', x);
    this.celestialBody.setAttributeNS(null, 'cy', y);
    this.celestialBody.setAttributeNS(null, 'r', radius);
    this.celestialBody.setAttributeNS(null, 'fill', this.color);
    this.celestialBody.setAttributeNS(null, 'stroke', 'none');
    this.celestialBody.setAttributeNS(null, 'data-id', this.id);
    if(filter) this.celestialBody.setAttributeNS(null, 'filter', `url(#${ filter })`);
    
    this.setColor = this.setColor.bind(this);
    this.setRadius = this.setRadius.bind(this);
    
    this.editableProps = {
      color: {
        handler: this.setColor,
        label: 'Color',
        type: CelestialBody.EDITABLE_TYPE__COLOR,
        value: () => this.color,
      },
      radius: {
        handler: this.setRadius,
        label: 'Radius',
        min: CelestialBody.SIZE__MIN,
        max: CelestialBody.SIZE__MAX,
        type: CelestialBody.EDITABLE_TYPE__NUMBER,
        value: () => +this.radius,
      },
    };
  }
  
  setColor(color) {
    this.celestialBody.setAttributeNS(null, 'fill', color);
    this.color = color;
  }
  
  setRadius(radius) {
    let normalizedRadius = radius;
    
    if(normalizedRadius < CelestialBody.SIZE__MIN){
      normalizedRadius = CelestialBody.SIZE__MIN;
    }
    else if(normalizedRadius > CelestialBody.SIZE__MAX){
      normalizedRadius = CelestialBody.SIZE__MAX;
    }
    
    normalizedRadius = Math.round(normalizedRadius);
    
    this.celestialBody.setAttributeNS(null, 'r', normalizedRadius);
    this.radius = normalizedRadius;
  }
}

CelestialBody.EDITABLE_TYPE__COLOR = 'color';
CelestialBody.EDITABLE_TYPE__NUMBER = 'number';
CelestialBody.EDITABLE_TYPE__SELECT = 'select';
CelestialBody.SIZE__MIN = 10;
CelestialBody.SIZE__MAX = 100;