import Creator from 'COMPONENTS/Creator';
import Grid from 'COMPONENTS/Grid';
import RootNav from 'COMPONENTS/RootNav';
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
let creatorContainer;
let creator;
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
  const { left, top } = creatorContainer.getBoundingClientRect();
  contXPos = left;
  contYPos = top;
}

function addListeners() {
  window.addEventListener('resize', handleResize);
  creatorContainer.addEventListener('mousedown', handleMouseDown);
  creatorContainer.addEventListener('mousemove', handleMouseMove);
  creatorContainer.addEventListener('mouseleave', handleMouseLeave);
  creatorContainer.addEventListener('mouseup', handleMouseUp);
}

document.addEventListener('DOMContentLoaded', () => {
  container = document.createElement('div');
  container.setAttribute('class', 'container');
  document.body.append(container);
  
  const rootNav = new RootNav({
    onClear: () => { creator.clear(); },
    onSimulate: () => { creator.simulate(); },
  });
  container.append(rootNav.nav);
  
  creatorContainer = document.createElement('div');
  creatorContainer.setAttribute('class', 'creator-container');
  container.append(creatorContainer);
  
  const grid = new Grid({
    lineColor: 'rgba(255, 255, 255, 0.1)',
  });
  creatorContainer.append(grid.container);
  eventHandlers.mouseMove.push(grid.mouseMoved);
  eventHandlers.mouseLeave.push(grid.mouseLeft);
  
  creator = new Creator({
    parentEl: creatorContainer,
  });
  creatorContainer.append(creator.parentSVG);
  eventHandlers.mouseDown.push(creator.mouseDown);
  eventHandlers.mouseMove.push(creator.mouseMoved);
  eventHandlers.mouseUp.push(creator.mouseUp);
  
  addListeners();
  handleResize();
});