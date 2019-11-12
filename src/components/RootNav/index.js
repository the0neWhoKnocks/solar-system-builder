import addStyles from 'UTILS/addStyles';

export default class RootNav {
  constructor({
    className = 'root-nav',
    onClear,
  } = {}) {
    addStyles('rnStyles', `
      .${ className } {
        padding: 0.25em;
        background: #ccc;
        display: flex;
        justify-content: flex-end;
        position: absolute;
        bottom: 100%;
        left: 0;
        right: 0;
      }
    `);
    
    this.nav = document.createElement('nav');
    this.nav.setAttribute('class', className);
    
    if(onClear){
      const btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.addEventListener('click', onClear);
      btn.innerText = 'Clear';
      this.nav.append(btn);
    }
  }
}