const fs = require('fs');
const path = require('path');

const serveIndexFallbackPlugin = (rootDir) => {
  return {
    name: 'serve-index-fallback',
    setup(build) {
      build.onLoad({ filter: /.*/ }, async (args) => {
        const filePath = path.join(rootDir, args.path);

        if (fs.existsSync(filePath)) {
          // Return the requested file if it exists
          return {
            contents: fs.readFileSync(filePath),
            loader: 'file',
          };
        } else {
          // Return the root index.html if the file doesn't exist
          const indexPath = path.join(rootDir, 'index.html');
          return {
            contents: fs.readFileSync(indexPath),
            loader: 'file',
          };
        }
      });
    },
  };
};

module.exports = serveIndexFallbackPlugin;
