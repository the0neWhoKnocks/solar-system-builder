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
    
    this.parentSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.parentSVG.setAttributeNS(null, 'class', className);
    this.parentSVG.setAttributeNS(null, 'width', parentEl.offsetWidth);
    this.parentSVG.setAttributeNS(null, 'height', parentEl.offsetHeight);
    
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseMoved = this.mouseMoved.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
  }
  
  mouseDown({ mouseX, mouseY }) {
    this.startX = mouseX;
    this.startY = mouseY;
    this.planet = new Planet({
      parentEl: this.parentSVG,
      x: this.startX,
      y: this.startY,
    });
    this.mouseIsDown = true;
  }
  
  mouseMoved({ mouseX, mouseY }) {
    if(this.mouseIsDown){
      const diffX = mouseX - this.startX;
      const diffY = mouseY - this.startY;
      const radius = Math.sqrt( (diffX * diffX) + (diffY * diffY) );
      this.planet.setRadius(radius);
    }
  }
  
  mouseUp() {
    this.mouseIsDown = false;
  }
}