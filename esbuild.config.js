const esbuild = require('esbuild');
const serveIndexFallbackPlugin = require('./serve-index-fallback-plugin');
const path = require('path');

const rootDir = path.join(__dirname, 'dist');

const buildOptions = {
  logLevel: "info",
  entryPoints: ['src/app.ts'],
  minify: true,
  outdir: 'dist',
  sourcemap: true,
  target: ['chrome58', 'firefox57', 'safari11', 'edge16', 'es2017'],
  bundle: true,
  sourcemap: true,
  plugins: [serveIndexFallbackPlugin(rootDir)],
};

const watchOptions = {
  onRebuild(error) {
    if (error) {
      console.error('Watch build failed:', error);
    } else {
      console.log('Watch build succeeded');
    }
  },
};

(async () => {
  const { serve } = await import('esbuild-serve');

  serve(
    {
      servedir: 'dist',
    },
    {
      ...buildOptions,
      watch: {
        ...watchOptions,
        watchDirs: ['src'],
      },
    }
  )
  .then((server) => {
    console.log(`Server running at http://localhost:${server.port}`);
  })
  .catch(() => process.exit(1));
})();

