export default class CelestialBody {
  static genColor() {
    return `#${ ('000000' + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6) }`;
  }
  
  constructor({
    color,
    filter,
    gravity = CelestialBody.DEFAULT__GRAVITY,
    id,
    radius = CelestialBody.SIZE__MIN,
    x = 0,
    y = 0,
  } = {}) {
    this.color = color || CelestialBody.genColor();
    this.gravity = gravity;
    this.id = id || Date.now();
    this.radius = radius;
    this.x = x;
    this.y = y;
    
    this.gravityField = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.gravityField.setAttributeNS(null, 'data-id', `${ this.id }_gF`);
    this.gravityField.setAttributeNS(null, 'cx', x);
    this.gravityField.setAttributeNS(null, 'cy', y);
    this.gravityField.setAttributeNS(null, 'r', radius * gravity);
    this.gravityField.setAttributeNS(null, 'fill', 'none');
    this.gravityField.setAttributeNS(null, 'stroke', this.color);
    this.gravityField.setAttributeNS(null, 'stroke-opacity', '15%');
    
    this.celestialBody = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.celestialBody.setAttributeNS(null, 'cx', x);
    this.celestialBody.setAttributeNS(null, 'cy', y);
    this.celestialBody.setAttributeNS(null, 'r', radius);
    this.celestialBody.setAttributeNS(null, 'fill', this.color);
    this.celestialBody.setAttributeNS(null, 'stroke', 'none');
    this.celestialBody.setAttributeNS(null, 'data-id', this.id);
    if(filter) this.celestialBody.setAttributeNS(null, 'filter', `url(#${ filter })`);
    
    this.group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.group.append(this.gravityField);
    this.group.append(this.celestialBody);
    
    this.setColor = this.setColor.bind(this);
    this.setGravity = this.setGravity.bind(this);
    this.setRadius = this.setRadius.bind(this);
    
    this.editableProps = {
      color: {
        handler: this.setColor,
        label: 'Color',
        type: CelestialBody.EDITABLE_TYPE__COLOR,
        value: () => this.color,
      },
      gravity: {
        handler: this.setGravity,
        label: 'Gravity',
        min: 0,
        max: 50,
        type: CelestialBody.EDITABLE_TYPE__NUMBER,
        value: () => +this.gravity,
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
    this.gravityField.setAttributeNS(null, 'stroke', color);
    this.celestialBody.setAttributeNS(null, 'fill', color);
    this.color = color;
  }
  
  setGravity(gravity) {
    this.gravityField.setAttributeNS(null, 'r', this.radius * gravity);
    this.gravity = gravity;
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
    
    this.gravityField.setAttributeNS(null, 'r', normalizedRadius * this.gravity);
    this.celestialBody.setAttributeNS(null, 'r', normalizedRadius);
    this.radius = normalizedRadius;
  }
}

CelestialBody.DEFAULT__GRAVITY = 2;
CelestialBody.EDITABLE_TYPE__COLOR = 'color';
CelestialBody.EDITABLE_TYPE__NUMBER = 'number';
CelestialBody.EDITABLE_TYPE__SELECT = 'select';
CelestialBody.SIZE__MIN = 10;
CelestialBody.SIZE__MAX = 100;