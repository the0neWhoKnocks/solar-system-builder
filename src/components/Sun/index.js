import CelestialBody from 'COMPONENTS/CelestialBody';

export default class Sun extends CelestialBody {
  constructor(opts) {
    opts.color = '#FFFFFF';
    super(opts);
    
    delete this.editableProps.color;
    
    this.celestialBody.setAttributeNS(null, 'filter', 'url(#glow)');
  }
}