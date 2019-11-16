import Asteroid from 'COMPONENTS/Asteroid';
import BlackHole from 'COMPONENTS/BlackHole';
import CelestialBody from 'COMPONENTS/CelestialBody';
import Dialog from 'COMPONENTS/Dialog';
import Moon from 'COMPONENTS/Moon';
import Planet from 'COMPONENTS/Planet';
import Sun from 'COMPONENTS/Sun';
import addStyles from 'UTILS/addStyles';

const TYPES = [
  Asteroid,
  BlackHole,
  Moon,
  Planet,
  Sun,
];

export default class Creator {
  constructor({
    className = 'creator',
    parentEl,
  } = {}) {
    addStyles('pcStyles', `
      .${ className } {
        position: absolute;
        top: 0;
        left: 0;
      }
      
      .${ className }-container {
        background: black;
      }
      
      .${ className }__dialog form {
        padding: 1em;
      }
      .${ className }__dialog-prop {
        padding-bottom: 0.5em;
        border-bottom: solid 1px #dadada;
        margin-bottom: 0.5em;
        display: flex;
        justify-content: space-between;
      }
      .${ className }__dialog-prop *:first-child {
        margin-left: 1em;
      }
      .${ className }__dialog-menu {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: flex-end;
      }
      .${ className }__dialog-menu button {
        width: 100%;
      }
    `);
    
    this.celestialBodies = {};
    this.className = className;
    this.parentEl = parentEl;
    
    this.parentSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.parentSVG.setAttributeNS(null, 'class', className);
    this.parentSVG.setAttributeNS(null, 'width', parentEl.offsetWidth);
    this.parentSVG.setAttributeNS(null, 'height', parentEl.offsetHeight);
    
    this.defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    this.parentSVG.append(this.defs);
    
    this.glowFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    this.glowFilter.setAttributeNS(null, 'id', 'glow');
    this.glowFilter.setAttributeNS(null, 'width', '600%');
    this.glowFilter.setAttributeNS(null, 'height', '600%');
    this.glowFilter.setAttributeNS(null, 'x', '-150%');
    this.glowFilter.setAttributeNS(null, 'y', '-150%');
    this.glowFilter.innerHTML = `
      <!-- Thicken out the original shape -->
      <feMorphology operator="dilate" radius="4" in="SourceAlpha" result="thicken" />

      <!-- Use a gaussian blur to create the soft blurriness of the glow -->
      <feGaussianBlur in="thicken" stdDeviation="10" result="blurred" />

      <!-- Change the colour -->
      <feFlood flood-color="rgb(255, 255, 255)" result="glowColor" />

      <!-- Color in the glows -->
      <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />

      <!--	Layer the effects together -->
      <feMerge>
        <feMergeNode in="softGlow_colored"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    `;
    this.defs.append(this.glowFilter);
    
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseMoved = this.mouseMoved.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    
    this.handleClick = this.handleClick.bind(this);
    
    this.addListeners();
  }
  
  addListeners() {
    this.parentSVG.addEventListener('click', this.handleClick);
  }
  
  addEditablePropsToDialog(celestialBody) {
    const errors = [];
    let editableMarkup = '';
    
    Object.keys(celestialBody.editableProps).forEach((prop) => {
      const data = celestialBody.editableProps[prop];
      const value = data.value();
      let markup = '';
      
      switch(data.type){
        case CelestialBody.EDITABLE_TYPE__COLOR:
          if(value.lenth < 6) errors.push(`- [${ prop }] Hex colors should be 6 characters long, recieved '${ value }'`);
          
          markup = `<input type="color" name="${ prop }" value="${ value }" />`;
          break;
          
        case CelestialBody.EDITABLE_TYPE__NUMBER: {
          if(value === undefined) errors.push(`- [${ prop }] Missing value`);
          
          const min = (data.min !== undefined) ? `min="${ data.min }"` : '';
          const max = (data.max !== undefined) ? `max="${ data.max }"` : '';
          
          markup = `<input type="number" name="${ prop }" ${ min } ${ max } value="${ value }" />`;
          break;
        }
          
        case CelestialBody.EDITABLE_TYPE__SELECT:
          if(!data.options || !data.options.length) errors.push(`- [${ prop }] Missing options`);
          
          markup = `<select name="${ prop }">${ data.options.map((option) => {
            return `<option value="${ option }" ${ value === option ? 'selected' : '' }>${ option }</option>`;
          }) }</select>`;
          break;
      }
      
      editableMarkup += `<label class="${ this.className }__dialog-prop">${ data.label }: ${ markup }</label>`;
    });
    
    document.getElementById('editableProps').innerHTML = editableMarkup;
    
    if(errors.length) alert(`[ERROR] Missing required values\n${ errors.join('\n') }`);
  }
  
  clear() {
    [...this.parentSVG.childNodes].forEach((el) => {
      if(el.nodeName !== 'defs') el.remove();
    });
    this.celestialBodies = {};
  }
  
  editAttributes(celestialBody) {
    let currentCelestialBody = celestialBody;
    let originalCelestialBody = celestialBody;
    
    const typeSelect = `<select name="type">${ TYPES.map((type) => {
      const currType = currentCelestialBody.constructor.name;
      const option = type.name;
      return `<option value="${ option }" ${ currType === option ? 'selected' : '' }>${ option }</option>`;
    }) }</select>`;
    
    const dialog = new Dialog({
      className: `${ this.className }__dialog`,
      content: `
        <form>
          <label class="${ this.className }__dialog-prop">Type: ${ typeSelect }</label>
          <div id="editableProps"></div>
          <menu class="${ this.className }__dialog-menu">
            <button type="button">Cancel</button>
            <button type="submit">Save</button>
          </menu>
        </form>
      `,
      onCancel: () => {
        if(currentCelestialBody !== originalCelestialBody){
          currentCelestialBody.group.remove();
          this.celestialBodies[currentCelestialBody.id] = originalCelestialBody;
          this.parentSVG.appendChild(originalCelestialBody.group);
        }
        
        this.dialogIsOpen = false;
      },
      onSubmit: (type, formData) => {
        [...formData].forEach(([prop, value]) => {
          const eP = currentCelestialBody.editableProps[prop];
          if(eP) eP.handler(value);
        });
        this.dialogIsOpen = false;
      },
      parentEl: this.parentEl,
      x: currentCelestialBody.x,
      y: currentCelestialBody.y,
    });
    
    this.addEditablePropsToDialog(currentCelestialBody);
    
    this.dialogIsOpen = true;
    
    dialog.dialogWindow.addEventListener('change', (ev) => {
      if(ev.target.name === 'type'){
        const Type = TYPES.find((type) => type.name === ev.target.value);
        
        if(Type.name !== currentCelestialBody.constructor.name){
          const { color, gravity, id, radius, rotation, x, y } = currentCelestialBody;
          currentCelestialBody.group.remove();
          currentCelestialBody = (Type.name === originalCelestialBody.constructor.name)
            ? originalCelestialBody
            : new Type({ color, gravity, id, radius, rotation, x, y });
          this.celestialBodies[id] = currentCelestialBody;
          this.addEditablePropsToDialog(currentCelestialBody);
          dialog.updatePosition({ x, y });
          this.parentSVG.appendChild(currentCelestialBody.group);
        }
      }
    });
    dialog.dialogWindow.addEventListener('input', (ev) => {
      const prop = ev.target.name;
      const value = ev.target.value;
      const eP = currentCelestialBody.editableProps[prop];
      
      if(eP) eP.handler(value);
    });
  }
  
  findGravitationalRelationships() {
    const effects = {};
    
    Object.keys(this.celestialBodies).forEach((currId) => {
      const currCB = this.celestialBodies[currId];
      const { gravityFieldVal, x: currX, y: currY } = currCB;
      
      Object.keys(this.celestialBodies).forEach((id) => {
        if(id !== currId){
          const cB = this.celestialBodies[id];
          const { radius, x, y } = cB;
          const intersects = Math.hypot(currX - x, currY - y) <= (gravityFieldVal + radius);

          if(intersects){
            if(!effects[currId]) effects[currId] = [];
            effects[currId].push(cB);
          }
        }
      });
    });
    
    return effects;
  }
  
  handleClick(ev) {
    const el = ev.target;
    
    if(!this.mouseIsDown && el.nodeName !== 'svg'){
      this.editAttributes(this.celestialBodies[el.getAttribute('data-id')]);
    }
  }
  
  mouseDown({ mouseX, mouseY }) {
    if(!this.dialogIsOpen){
      this.startX = mouseX;
      this.startY = mouseY;
      this.mouseIsDown = true;
    }
  }
  
  mouseMoved({ mouseX, mouseY }) {
    if(this.mouseIsDown){
      const diffX = mouseX - this.startX;
      const diffY = mouseY - this.startY;
      const radius = Math.sqrt( (diffX * diffX) + (diffY * diffY) );
      
      if(!this.currentCelestialBody && radius >= Planet.SIZE__MIN){
        this.currentCelestialBody = new Planet({
          x: this.startX,
          y: this.startY,
        });
        this.parentSVG.appendChild(this.currentCelestialBody.group);
        this.celestialBodies[this.currentCelestialBody.id] = this.currentCelestialBody;
      }
      else if(this.currentCelestialBody){
        this.currentCelestialBody.setRadius(radius);
      }
    }
  }
  
  mouseUp() {
    this.currentCelestialBody = undefined;
    this.mouseIsDown = false;
  }
  
  rotateAroundPoint(x, y, angle, cB) {
    const radians = (angle) * (Math.PI/180);
    const rotatedX = Math.cos(radians) * (cB.x - x) - Math.sin(radians) * (cB.y - y) + x;
    const rotatedY = Math.sin(radians) * (cB.x - x) + Math.cos(radians) * (cB.y - y) + y;
    cB.setPos({ x: rotatedX, y: rotatedY });
  }
  
  getDistanceBetweenPoints(p1x, p1y, p2x, p2y) {
    return Math.sqrt( Math.pow((p1x - p2x), 2) + Math.pow((p1y - p2y), 2) );
  }
  
  startSimulation() {
    const relationships = this.findGravitationalRelationships();
    const ORBIT_SPEED = 1;
    
    const orbit = () => {
      Object.keys(relationships).forEach((id) => {
        const { gravityFieldVal, rotation, x, y } = this.celestialBodies[id];
        relationships[id].forEach((cB) => {
          const dist = this.getDistanceBetweenPoints(x, y, cB.x, cB.y);
          let orbitSpeed = ORBIT_SPEED * Math.abs(Math.round(dist - gravityFieldVal) / 100);
          if(rotation === CelestialBody.ROTATION__COUNTER_CLOCKWISE) orbitSpeed *= -1;
          this.rotateAroundPoint(x, y, orbitSpeed, cB);
        });
      });
    };
    
    const render = () => {
      if(this.runSimulation){
        orbit();
        window.requestAnimationFrame(render);
      }
    };
    
    this.runSimulation = true;
    render();
  }
  
  stopSimulation() {
    this.runSimulation = false;
  }
}