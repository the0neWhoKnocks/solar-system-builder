import CelestialBody from 'COMPONENTS/CelestialBody';

export default class Sun extends CelestialBody {
  constructor(opts) {
    opts.color = '#FFFFFF';
    opts.filter = 'glow';
    super(opts);
    
    delete this.editableProps.color;
  }
}