export default class CelestialBody {
  static genColor() {
    return `#${ Math.floor(Math.random()*16777215).toString(16) }`;
  }
  
  constructor({
    color,
    parentEl,
    radius = CelestialBody.SIZE__MIN,
    type = CelestialBody.TYPE__PLANET,
    x = 0,
    y = 0,
  } = {}) {
    this.color = color || CelestialBody.genColor();
    this.id = Date.now();
    this.radius = radius;
    this.type = type;
    
    this.celestialBody = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.celestialBody.setAttributeNS(null, 'cx', x);
    this.celestialBody.setAttributeNS(null, 'cy', y);
    this.celestialBody.setAttributeNS(null, 'r', radius);
    this.celestialBody.setAttributeNS(null, 'fill', this.color);
    this.celestialBody.setAttributeNS(null, 'stroke', 'none');
    this.celestialBody.setAttributeNS(null, 'data-id', this.id);
    
    parentEl.appendChild(this.celestialBody);
    
    this.setColor = this.setColor.bind(this);
    this.setRadius = this.setRadius.bind(this);
    this.setType = this.setType.bind(this);
    
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
      type: {
        handler: this.setType,
        label: 'Type',
        options: () => {
          const opts = [];
          Object.keys(CelestialBody).forEach((prop) => {
            if(prop.startsWith('TYPE__')) opts.push(CelestialBody[prop]);
          });
          return opts;
        },
        type: CelestialBody.EDITABLE_TYPE__SELECT,
        value: () => this.type,
      },
    };
  }
  
  editAttributes({
    parentEl,
  } = {}) {
    const dialog = document.createElement('dialog');
    parentEl.append(dialog);
    
    let dialogBody = '';
    Object.keys(this.editableProps).forEach((prop) => {
      const data = this.editableProps[prop];
      const value = data.value();
      let markup = '';
      
      switch(data.type){
        case CelestialBody.EDITABLE_TYPE__COLOR:
          markup = `<input type="color" name="${ prop }" value="${ value }" />`;
          break;
        
        case CelestialBody.EDITABLE_TYPE__NUMBER:
          markup = `<input type="number" name="${ prop }" min="${ data.min }" max="${ data.max }" value="${ value }" />`;
          break;
          
        case CelestialBody.EDITABLE_TYPE__SELECT:
          markup = `<select name="${ prop }">${ data.options().map((option) => {
            return `<option value="${ option }" ${ value === option ? 'selected' : '' }>${ option }</option>`;
          }) }</select>`;
          break;
      }
      
      dialogBody += `<p><label>${ data.label }: ${ markup }</label></p>`;
    });
    
    dialog.innerHTML = `
      <form method="dialog">
        ${ dialogBody }
        <menu>
          <button value="cancel">Cancel</button>
          <button value="save">Save</button>
        </menu>
      </form>
    `;
    
    dialog.showModal();
    dialog.addEventListener('close', () => {
      if(dialog.returnValue === 'save'){
        const formData = new FormData(dialog.querySelector('form'));
        [...formData].forEach(([prop, value]) => {
          this.editableProps[prop].handler(value);
        });
      }
    });
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
  
  setType(type) {
    // TODO - have pre-defined types, that set things like color, radius, etc.
    this.type = type;
  }
}

CelestialBody.EDITABLE_TYPE__COLOR = 'color';
CelestialBody.EDITABLE_TYPE__NUMBER = 'number';
CelestialBody.EDITABLE_TYPE__SELECT = 'select';
CelestialBody.SIZE__MIN = 10;
CelestialBody.SIZE__MAX = 100;
CelestialBody.TYPE__ASTEROID = 'asteroid';
CelestialBody.TYPE__BLACK_HOLE = 'black hole';
CelestialBody.TYPE__MOON = 'moon';
CelestialBody.TYPE__PLANET = 'planet';
CelestialBody.TYPE__SUN = 'sun';