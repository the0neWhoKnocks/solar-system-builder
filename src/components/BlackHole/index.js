import CelestialBody from 'COMPONENTS/CelestialBody';

export default class BlackHole extends CelestialBody {
  constructor(opts) {
    opts.color = '#000000';
    super(opts);
    
    delete this.editableProps.color;
  }
}