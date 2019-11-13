import CelestialBody from 'COMPONENTS/CelestialBody';

export default class Sun extends CelestialBody {
  constructor({
    gravity = Sun.DEFAULT__GRAVITY,
    ...opts
  } = {}) {
    opts.color = '#FFFFFF';
    super(opts);
    
    this.gravity = gravity;
    
    this.setGravity = this.setGravity.bind(this);
    
    this.editableProps = {
      ...this.editableProps,
      gravity: {
        handler: this.setGravity,
        label: 'Gravity',
        min: Sun.GRAVITY__MIN,
        max: Sun.GRAVITY__MAX,
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

Sun.DEFAULT__GRAVITY = 10;
Sun.GRAVITY__MIN = 2;
Sun.GRAVITY__MAX = 50;