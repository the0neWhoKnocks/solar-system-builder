import Grid from 'COMPONENTS/Grid';
import PlanetCreator from 'COMPONENTS/PlanetCreator';
import addStyles from 'UTILS/addStyles';

addStyles('rootStyles', `
  html, body {
    padding: 0;
    margin: 0;
  }
  body {
    background: #000;
  }
  
  .container {
    overflow: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`);

const eventHandlers = {
  mouseDown: [],
  mouseLeave: [],
  mouseMove: [],
  mouseUp: [],
};
let container;
let contXPos;
let contYPos;

const getTrueCoOrds = (ev) => {
  const mouseX = Math.max(0, ev.x - contXPos);
  const mouseY = Math.max(0, ev.y - contYPos);
  return { mouseX, mouseY };
};

function handleMouseDown(ev) {
  eventHandlers.mouseDown.forEach((handler) => {
    handler(getTrueCoOrds(ev));
  });
}

function handleMouseMove(ev) {
  eventHandlers.mouseMove.forEach((handler) => {
    handler(getTrueCoOrds(ev));
  });
}

function handleMouseLeave() {
  eventHandlers.mouseLeave.forEach((handler) => {
    handler();
  });
}

function handleMouseUp() {
  eventHandlers.mouseUp.forEach((handler) => {
    handler();
  });
}

function handleResize() {
  const { left, top } = container.getBoundingClientRect();
  contXPos = left;
  contYPos = top;
}

function addListeners() {
  window.addEventListener('resize', handleResize);
  container.addEventListener('mousedown', handleMouseDown);
  container.addEventListener('mousemove', handleMouseMove);
  container.addEventListener('mouseleave', handleMouseLeave);
  container.addEventListener('mouseup', handleMouseUp);
}

document.addEventListener('DOMContentLoaded', () => {
  container = document.createElement('div');
  container.setAttribute('class', 'container');
  document.body.append(container);
  
  const grid = new Grid({
    lineColor: 'rgba(255, 255, 255, 0.1)',
  });
  container.append(grid.container);
  eventHandlers.mouseMove.push(grid.mouseMoved);
  eventHandlers.mouseLeave.push(grid.mouseLeft);
  
  const pC = new PlanetCreator({
    parentEl: container,
  });
  container.append(pC.parentSVG);
  eventHandlers.mouseDown.push(pC.mouseDown);
  eventHandlers.mouseMove.push(pC.mouseMoved);
  eventHandlers.mouseUp.push(pC.mouseUp);
  
  addListeners();
  handleResize();
});