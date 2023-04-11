import { Context, Dict, Random, Schema } from 'koishi'
import WebSocket from 'ws';

export const name = 'forward-all'

const descriptions = {
  enable: '是否开启 WebSocket 转发',
  port: 'WebSocket 服务端口'
}
export interface Config {
  enable: boolean
  port: number
}
export const Config: Schema<Config> = Schema.object({
  enable: Schema.boolean().default(false).description(descriptions.enable),
  port: Schema.number().default(9388).description(descriptions.port),
})


export default (ctx: Context, config: Config): void => {
  if (!config.enable){
    console.log('WebSocket server is disabled.');
    return;
  }
  const server = new WebSocket.Server({ port: config.port});
  console.log(`WebSocket server listening on port ${config.port}.`);
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