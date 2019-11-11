import Planet from 'COMPONENTS/Planet';
import addStyles from 'UTILS/addStyles';

export default class PlanetCreator {
  constructor({
    className = 'planet-creator',
    parentEl,
  }) {
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
    
    this.defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    this.parentSVG.append(this.defs);
    
    this.gradDef = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    this.gradDef.setAttributeNS(null, 'id', 'radGrad');
    this.gradDef.setAttributeNS(null, 'cx', '55%');
    this.gradDef.setAttributeNS(null, 'cy', '40%');
    this.gradDef.setAttributeNS(null, 'r', '60%');
    this.gradDef.setAttributeNS(null, 'fx', '70%');
    this.gradDef.setAttributeNS(null, 'fy', '20%');
    this.defs.append(this.gradDef);
    this.stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    this.stop1.setAttributeNS(null, 'offset', '0%');
    this.stop1.setAttributeNS(null, 'style', 'stop-color:rgb(255,255,255); stop-opacity:1');
    this.gradDef.append(this.stop1);
    this.stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    this.stop2.setAttributeNS(null, 'offset', '100%');
    this.stop2.setAttributeNS(null, 'style', 'stop-color:rgb(20,20,20); stop-opacity:1');
    this.gradDef.append(this.stop2);
    
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