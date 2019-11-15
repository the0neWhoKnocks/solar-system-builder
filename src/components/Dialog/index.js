import addStyles from 'UTILS/addStyles';

export default class Dialog {
  constructor({
    className = 'dialog',
    content = '',
    onCancel,
    onSubmit,
    parentEl,
    x = 0,
    y = 0,
  } = {}) {
    addStyles('dialogStyles', `
      .${ className } {
        font-family: Helvetica, Arial, sans-serif;
        border: solid 1px #b7b7b7;
        border-radius: 0.25em;
        padding: 0;
        margin: 0;
        box-shadow: 0 6px 10px 3px;
        background: #eee;
        position: absolute;
        top: 0;
        left: 0;
      }
      
      .${ className }-backdrop {
        background: rgba(38, 45, 56, 0.5);  
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
      }
    `);
    
    this.onCancel = onCancel;
    this.onSubmit = onSubmit;
    
    this.backdrop = document.createElement('div');
    this.backdrop.setAttribute('class', `${ className }-backdrop`);
    this.dialogWindow = document.createElement('div');
    this.dialogWindow.setAttribute('class', `${ className }`);
    
    parentEl.append(this.backdrop);
    parentEl.append(this.dialogWindow);
    this.dialogWindow.innerHTML = content;
    
    this.dialogWindow.style.top = `${ y }px`;
    this.dialogWindow.style.left = `${ x }px`;
    
    this.handleClick = this.handleClick.bind(this);
    
    this.backdrop.addEventListener('click', this.handleClick);
    this.dialogWindow.addEventListener('click', this.handleClick);
  }
  
  handleClick(ev) {
    const target = ev.target;
    
    if(target.nodeName === 'BUTTON'){
      if(target.type === 'submit'){
        ev.preventDefault();
        const formData = new FormData(this.dialogWindow.querySelector('form'));
        if(this.onSubmit) this.onSubmit(target.name, formData);
      }
      else if(this.onCancel) this.onCancel();
      
      this.remove();
    }
  }
  
  remove() {
    this.backdrop.remove();
    this.dialogWindow.remove();
  }
}