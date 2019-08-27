import { create } from 'browser-sync';

const browserSync = create();

// https://www.browsersync.io/docs/options
browserSync.init({
  // files to watch for changes
  files: [
    // NOTE - using babel-node to transform aliases
    'PUBLIC/index.html',
  ],
  ghostMode: false, // don't mirror interactions in other browsers
  // logLevel: 'debug',
  // notify: false, // Don't show any notifications in the browser.
  open: false,
  proxy: 'http://localhost:3000',
  // Wait X seconds after a reload event before allowing more.
  // reloadDebounce: 1000,
  // Wait X seconds before any browsers should try to inject/reload a file.
  reloadDelay: 1000,
  snippetOptions: {
    rule: {
      match: /<\/body>/i,
      fn: (snippet) => snippet,
    },
  },
});
