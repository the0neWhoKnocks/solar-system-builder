const { aliases } = require('./conf.repo');

module.exports = (api) => {
  api.cache(true);
  
  // Settings used for building npm distributable module
  // https://babeljs.io/docs/en/6.26.3/babel-preset-env
  return {
    plugins: [
      ['@noxx/babel-plugin-a2rp', { aliases }],
    ],
    presets: [
      ['@babel/preset-env', {
        // debug: true,
        targets: {
          chrome: '75',
          edge: '44',
          firefox: '67',
        },
      }],
    ],
  };
};
