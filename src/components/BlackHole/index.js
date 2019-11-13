import CelestialBody from 'COMPONENTS/CelestialBody';

export default class BlackHole extends CelestialBody {
  constructor({
    gravity = BlackHole.DEFAULT__GRAVITY,
    ...opts
  } = {}) {
    opts.color = '#000000';
    super(opts);
    
    this.gravity = gravity;
    
    this.setGravity = this.setGravity.bind(this);
    
    this.editableProps = {
      ...this.editableProps,
      gravity: {
        handler: this.setGravity,
        label: 'Gravity',
        min: BlackHole.GRAVITY__MIN,
        max: BlackHole.GRAVITY__MAX,
        type: CelestialBody.EDITABLE_TYPE__NUMBER,
        value: () => +this.gravity,
      },
    };
    delete this.editableProps.color;
  }
  
  setGravity(gravity) {
    this.gravity = gravity;
  }
}

BlackHole.DEFAULT__GRAVITY = 10;
BlackHole.GRAVITY__MIN = 2;
BlackHole.GRAVITY__MAX = 50;