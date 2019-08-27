const { resolve } = require('path');

const ROOT = resolve(__dirname, './');
const PUBLIC = `${ ROOT }/public`;
const PUBLIC_JS = `${ PUBLIC }/js`;
const SRC = `${ ROOT }/src`;

module.exports = {
  SRC,
  PUBLIC,
  PUBLIC_JS,
  VENDOR_CHUNK_NAME: 'js/vendor-bootstrap',
  aliases: {
    COMPONENTS: `${ SRC }/components`,
    PUBLIC,
  },
  entries: {
    'js/app': `${ SRC }/index.js`,
  },
};