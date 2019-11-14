export default class CelestialBody {
  static genColor() {
    return `#${ ('000000' + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6) }`;
  }
  
  static genArrowTransform({ pos, rotate, x, y }) {
    return {
      json: JSON.stringify({ pos, rotate, x, y }),
      value: `translate(${ x } ${ y }) rotate(${ rotate })`,
    };
  }
  
  static createArrow({ pos, rotate = 0, x = 0, y = 0 }) {
    const arrowSize = 10;
    const rotationArrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    const transform = CelestialBody.genArrowTransform({ pos, rotate, x, y });
    
    rotationArrow.setAttributeNS(null, 'points', `0,-${ arrowSize/2 } ${ arrowSize/2 },${ arrowSize/2 } 0,${ arrowSize*0.25 } -${ arrowSize/2 },${ arrowSize/2 }`);
    rotationArrow.setAttributeNS(null, 'data-transform', transform.json);
    
    return rotationArrow;
  }
  
  constructor({
    color,
    filter,
    gravity = CelestialBody.DEFAULT__GRAVITY,
    id,
    radius = CelestialBody.SIZE__MIN,
    rotation = CelestialBody.ROTATION__CLOCKWISE,
    x = 0,
    y = 0,
  } = {}) {
    this.color = color || CelestialBody.genColor();
    this.gravity = gravity;
    this.id = id || Date.now();
    this.radius = radius;
    this.rotation = rotation;
    this.x = x;
    this.y = y;
    
    this.gravityField = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.gravityField.setAttributeNS(null, 'cx', x);
    this.gravityField.setAttributeNS(null, 'cy', y);
    this.gravityField.setAttributeNS(null, 'r', radius * gravity);
    this.gravityField.setAttributeNS(null, 'fill', 'none');
    this.gravityField.setAttributeNS(null, 'stroke', this.color);
    this.gravityField.setAttributeNS(null, 'stroke-opacity', '15%');
    this.gravityField.setAttributeNS(null, 'data-id', `${ this.id }_gF`);
    
    this.directionalArrows = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.directionalArrows.setAttributeNS(null, 'fill', this.color);
    this.directionalArrows.setAttributeNS(null, 'fill-opacity', '25%');
    this.directionalArrows.setAttributeNS(null, 'stroke', 'none');
    this.directionalArrows.setAttributeNS(null, 'transform', `translate(${ x } ${ y })`);
    this.directionalArrows.append(CelestialBody.createArrow({ pos: 'top' }));
    this.directionalArrows.append(CelestialBody.createArrow({ pos: 'left' }));
    this.directionalArrows.append(CelestialBody.createArrow({ pos: 'bottom' }));
    this.directionalArrows.append(CelestialBody.createArrow({ pos: 'right' }));
    
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
    this.group.append(this.directionalArrows);
    this.group.append(this.celestialBody);
    
    this.setColor = this.setColor.bind(this);
    this.setGravity = this.setGravity.bind(this);
    this.setRadius = this.setRadius.bind(this);
    this.setRotation = this.setRotation.bind(this);
    
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
      rotation: {
        handler: this.setRotation,
        label: 'Rotation',
        options: [
          CelestialBody.ROTATION__CLOCKWISE,
          CelestialBody.ROTATION__COUNTER_CLOCKWISE,
        ],
        type: CelestialBody.EDITABLE_TYPE__SELECT,
        value: () => this.rotation,
      },
    };
  }
  
  renderDirectionalArrows() {
    const gravityRadius = this.radius * this.gravity;
    const isClockwise = this.rotation === CelestialBody.ROTATION__CLOCKWISE;
    
    [...this.directionalArrows.childNodes].forEach((arrow) => {
      const transforms = JSON.parse(arrow.getAttribute('data-transform'));
      switch(transforms.pos){
        case 'top': 
          transforms.y = -gravityRadius;
          transforms.rotate = (isClockwise) ? 90 : 270;
          break;
        
        case 'left':
          transforms.x = gravityRadius;
          transforms.rotate = (isClockwise) ? 180 : 0;
          break;
        
        case 'bottom':
          transforms.y = gravityRadius;
          transforms.rotate = (isClockwise) ? 270 : 90;
          break;
          
        case 'right':
          transforms.x = -gravityRadius;
          transforms.rotate = (isClockwise) ? 0 : 180;
          break;
      }
      
      const transform = CelestialBody.genArrowTransform({ ...transforms });
      arrow.setAttributeNS(null, 'transform', transform.value);
      arrow.setAttributeNS(null, 'data-transform', transform.json);
    });
  }
  
  setColor(color) {
    this.gravityField.setAttributeNS(null, 'stroke', color);
    this.directionalArrows.setAttributeNS(null, 'fill', color);
    this.celestialBody.setAttributeNS(null, 'fill', color);
    this.color = color;
  }
  
  setGravity(gravity) {
    this.gravityField.setAttributeNS(null, 'r', this.radius * gravity);
    this.gravity = gravity;
    this.renderDirectionalArrows();
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
    this.setGravity(this.gravity);
  }
  
  setRotation(rotation) {
    this.rotation = rotation;
    this.renderDirectionalArrows();
  }
}

CelestialBody.DEFAULT__GRAVITY = 2;
CelestialBody.EDITABLE_TYPE__COLOR = 'color';
CelestialBody.EDITABLE_TYPE__NUMBER = 'number';
CelestialBody.EDITABLE_TYPE__SELECT = 'select';
CelestialBody.ROTATION__CLOCKWISE = 'clockwise';
CelestialBody.ROTATION__COUNTER_CLOCKWISE = 'counter-clockwise';
CelestialBody.SIZE__MIN = 10;
CelestialBody.SIZE__MAX = 100;