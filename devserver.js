import liveServer from 'live-server';
import connect from 'connect';
import serveStatic from 'serve-static';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import fs from 'fs';

const rootDir = './dist';
const apiServerPort = 8080; // Your API server port
const webServerPort = 7000;

const app = connect();

// Middleware to serve the root index.html file if the requested file doesn't exist
app.use((req, res, next) => {
  const filePath = path.join(process.cwd(), rootDir, req.url);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      req.url = '/';
    }
    next();
  });
});

// Middleware to proxy API requests to another server
app.use(
  '/api',
  createProxyMiddleware({
    target: `http://localhost:${apiServerPort}`,
    changeOrigin: true,
  })
);

app.use(serveStatic(rootDir));

const serverConfig = {
  open: false,
  root: rootDir,
  port: webServerPort,
  middleware: [app],
};

liveServer.start(serverConfig);
