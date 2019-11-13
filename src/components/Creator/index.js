import Asteroid from 'COMPONENTS/Asteroid';
import BlackHole from 'COMPONENTS/BlackHole';
import CelestialBody from 'COMPONENTS/CelestialBody';
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
      
      .${ className }__dialog {
        font-family: Helvetica, Arial, sans-serif;
        border: solid 1px #b7b7b7;
        border-radius: 0.25em;
        box-shadow: 0 6px 10px 3px;
      }
      .${ className }__dialog::backdrop {
        background: rgba(38, 45, 56, 0.5);  
      }
      .${ className }__dialog-prop {
        margin-bottom: 1em;
        display: block;
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
          markup = `<input type="color" name="${ prop }" value="${ value }" />`;
          break;
          
        case CelestialBody.EDITABLE_TYPE__NUMBER:
          if(!data.min) errors.push(`- [${ prop }] Missing 'min' value for type '${ data.type }'`);
          if(!data.max) errors.push(`- [${ prop }] Missing 'max' value for type '${ data.type }'`);
          
          markup = `<input type="number" name="${ prop }" min="${ data.min }" max="${ data.max }" value="${ value }" />`;
          break;
          
        case CelestialBody.EDITABLE_TYPE__SELECT:
          markup = `<select name="${ prop }">${ data.options().map((option) => {
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
      el.remove();
    });
    this.celestialBodies = {};
  }
  
  editAttributes(celestialBody) {
    let currentCelestialBody = celestialBody;
    let originalCelestialBody = celestialBody;
    
    const dialog = document.createElement('dialog');
    dialog.setAttribute('class', `${ this.className }__dialog`);
    this.parentEl.append(dialog);
    
    const typeSelect = `<select name="type">${ TYPES.map((type) => {
      const currType = currentCelestialBody.constructor.name;
      const option = type.name;
      return `<option value="${ option }" ${ currType === option ? 'selected' : '' }>${ option }</option>`;
    }) }</select>`;
    
    dialog.innerHTML = `
      <form method="dialog">
        <label class="${ this.className }__dialog-prop">Type: ${ typeSelect }</label>
        <div id="editableProps"></div>
        <menu class="${ this.className }__dialog-menu">
          <button value="cancel">Cancel</button>
          <button value="save">Save</button>
        </menu>
      </form>
    `;
    
    this.addEditablePropsToDialog(currentCelestialBody);
    
    dialog.showModal();
    this.dialogIsOpen = true;
    
    dialog.addEventListener('change', (ev) => {
      if(ev.target.name === 'type'){
        const Type = TYPES.find((type) => type.name === ev.target.value);
        
        if(Type.name !== currentCelestialBody.constructor.name){
          const { color, id, radius, x, y } = currentCelestialBody;
          currentCelestialBody.celestialBody.remove();
          
          currentCelestialBody = new Type({ color, id, radius, x, y });
          this.celestialBodies[id] = currentCelestialBody;
          this.addEditablePropsToDialog(currentCelestialBody);
          this.parentSVG.appendChild(currentCelestialBody.celestialBody);
        }
      }
    });
    dialog.addEventListener('click', (ev) => {
      // The Dialog sits under the form, so if the Dialog is detected, the user
      // clicked on the backdrop, which means they want to close.
      if(ev.target.nodeName === 'DIALOG') dialog.close();
    });
    dialog.addEventListener('close', () => {
      if(dialog.returnValue === 'save'){
        const formData = new FormData(dialog.querySelector('form'));
        
        [...formData].forEach(([prop, value]) => {
          const eP = currentCelestialBody.editableProps[prop];
          if(eP) eP.handler(value);
        });
      }
      else{
        currentCelestialBody.celestialBody.remove();
        this.celestialBodies[currentCelestialBody.id] = originalCelestialBody;
        this.parentSVG.appendChild(originalCelestialBody.celestialBody);
      }
      
      this.dialogIsOpen = false;
      dialog.remove();
    });
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
        this.parentSVG.appendChild(this.currentCelestialBody.celestialBody);
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
}