import Grid from 'COMPONENTS/Grid';

const styles = document.createElement('style');
styles.innerHTML = `
  html, body {
    padding: 0;
    margin: 0;
  }
  body {
    background: #000;
  }
  
  .bg-grid {
    background: #262d38;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }  
`;
document.head.append(styles);

document.addEventListener('DOMContentLoaded', () => {
  document.body.append(new Grid({
    className: 'bg-grid',
    lineColor: 'rgba(255, 255, 255, 0.1)',
  }));
});