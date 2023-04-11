import { Context, Dict, Random, Schema } from 'koishi'
import WebSocket from 'ws';

interface WebSocketPluginOptions {
  port?: number;
}

export default (ctx: Context, options: WebSocketPluginOptions): void => {
  const server = new WebSocket.Server({ port: options.port || 9088 });

  server.on('connection', (socket) => {
    console.log('WebSocket client connected.');

    socket.on('message', (message) => {
      console.log('Received message:', message);
    });

    socket.on('close', () => {
      console.log('WebSocket client disconnected.');
    });
  });

  ctx.middleware(async (meta, next) => {
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {

        client.send(JSON.stringify(meta));
      }
    });

    return next();
  });
};