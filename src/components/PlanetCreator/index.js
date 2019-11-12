import Planet from 'COMPONENTS/Planet';
import addStyles from 'UTILS/addStyles';

export default class PlanetCreator {
  constructor({
    className = 'planet-creator',
    parentEl,
  } = {}) {
    addStyles('pcStyles', `
      .${ className } {
        position: absolute;
        top: 0;
        left: 0;
      }
    `);
    
    this.planets = {};
    
    this.parentSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.parentSVG.setAttributeNS(null, 'class', className);
    this.parentSVG.setAttributeNS(null, 'width', parentEl.offsetWidth);
    this.parentSVG.setAttributeNS(null, 'height', parentEl.offsetHeight);
    
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseMoved = this.mouseMoved.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    
    this.handleClick = this.handleClick.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    
    this.addListeners();
  }
  
  addListeners() {
    this.parentSVG.addEventListener('click', this.handleClick);
    this.parentSVG.addEventListener('contextmenu', this.handleContextMenu);
    // this.parentSVG.addEventListener('mouseover', this.handleMouseOver);
  }
  
  handleClick(ev) {
    const el = ev.target;
    
    if(!this.mouseIsDown && el.nodeName !== 'svg'){
      console.log('click', this.planets[el.getAttribute('data-id')]);
    }
  }
  
  handleContextMenu(ev) {
    ev.preventDefault();
    console.log('menu', ev.target);
  }
  
  handleMouseOver(ev) {
    const el = ev.target;
    
    if(!this.mouseIsDown && el.nodeName !== 'svg'){
      console.log('over', this.planets[el.getAttribute('data-id')]);
    }
  }
  
  mouseDown({ mouseX, mouseY }) {
    this.startX = mouseX;
    this.startY = mouseY;
    this.currentPlanet = new Planet({
      parentEl: this.parentSVG,
      x: this.startX,
      y: this.startY,
    });
    this.mouseIsDown = true;
    this.planets[this.currentPlanet.id] = this.currentPlanet;
  }
  
  mouseMoved({ mouseX, mouseY }) {
    if(this.mouseIsDown){
      const diffX = mouseX - this.startX;
      const diffY = mouseY - this.startY;
      const radius = Math.sqrt( (diffX * diffX) + (diffY * diffY) );
      this.currentPlanet.setRadius(radius);
    }
  }
  
  mouseUp() {
    this.mouseIsDown = false;
  }
}