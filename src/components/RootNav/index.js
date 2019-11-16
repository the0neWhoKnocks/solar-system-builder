import addStyles from 'UTILS/addStyles';

const pad = (num, token='00') => token.substring(0, token.length-`${ num }`.length) + num;

const d = new Date(window.BUILD_TIME);
const hour = d.getHours();
const strMonth = pad(d.getMonth() + 1);
const strDate = pad(d.getDate());
const strHour = hour > 12 ? pad(hour-12): pad(hour);
const strMins = pad(d.getMinutes());
const meridiem = hour >= 12 ? 'pm' : 'am';
const FORMATTED_BUILD_TIME = `${ strMonth }/${ strDate }/${ d.getFullYear() } ${ strHour }:${ strMins }${ meridiem }`;

export default class RootNav {
  constructor({
    className = 'root-nav',
    onClear,
    onSimulate,
  } = {}) {
    addStyles('rnStyles', `
      .${ className } {
        padding: 0.25em;
        background: #ccc;
        display: flex;
        justify-content: space-between;
        position: absolute;
        bottom: 100%;
        left: 0;
        right: 0;
      }
      .${ className }:first-child {
        font-family: monospace;
      }
    `);
    
    this.nav = document.createElement('nav');
    this.nav.setAttribute('class', className);
    
    this.nav.innerHTML = `
      <div>Built On: ${ FORMATTED_BUILD_TIME }</div>
      <div>
        <button class="${ className }__simulate-btn" type="button">Simulate</button>
        <button class="${ className }__clear-btn" type="button">Clear</button>
      </div>
    `;
    
    this.nav.querySelector(`.${ className }__clear-btn`).addEventListener('click', onClear);
    this.nav.querySelector(`.${ className }__simulate-btn`).addEventListener('click', onSimulate);
  }
}