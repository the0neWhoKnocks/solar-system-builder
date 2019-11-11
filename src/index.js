import Grid from 'COMPONENTS/Grid';
import addStyles from 'UTILS/addStyles';

addStyles('rootStyles', `
  html, body {
    padding: 0;
    margin: 0;
  }
  body {
    background: #000;
  }
`);

document.addEventListener('DOMContentLoaded', () => {
  document.body.append(new Grid({
    className: 'bg-grid',
    lineColor: 'rgba(255, 255, 255, 0.1)',
  }));
});