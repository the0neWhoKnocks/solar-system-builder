import CelestialBody from 'COMPONENTS/CelestialBody';
import addStyles from 'UTILS/addStyles';

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
    `);
    
    this.celestialBodies = {};
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
  
  handleClick(ev) {
    const el = ev.target;
    
    if(!this.mouseIsDown && el.nodeName !== 'svg'){
      const cB = this.celestialBodies[el.getAttribute('data-id')];
      cB.editAttributes({ parentEl: this.parentEl });
    }
  }
  
  mouseDown({ mouseX, mouseY }) {
    this.startX = mouseX;
    this.startY = mouseY;
    this.mouseIsDown = true;
  }
  
  mouseMoved({ mouseX, mouseY }) {
    if(this.mouseIsDown){
      const diffX = mouseX - this.startX;
      const diffY = mouseY - this.startY;
      const radius = Math.sqrt( (diffX * diffX) + (diffY * diffY) );
      
      if(!this.currentCelestialBody && radius >= CelestialBody.SIZE__MIN){
        this.currentCelestialBody = new CelestialBody({
          parentEl: this.parentSVG,
          x: this.startX,
          y: this.startY,
        });
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