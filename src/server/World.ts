import net, { Socket } from 'net';
import config from '../config';

class WorldServer {
  private netServer = net.createServer();
  private port = config.world.worldPort;
  private loginServer;
  private channelServers = [];

  constructor() {
    this.createServer();
  }

  private createServer() {
    this.netServer.on('connection', async (socket: Socket) => {
      socket.on('data', async (data) => {
        const functionCall = data.toString();
        const result = eval('this.' + functionCall);
        switch (typeof result) {
          case 'object':
            socket.write(JSON.stringify(result));
            break;
          default:
            socket.write(result.toString());
        }
      });
    });

    this.netServer.on('error', (error) => {
      console.log(error);
      process.exit(1);
    });

    this.netServer.listen(this.port, () => {
      console.log(`[World] Server on port ${this.port}`);
    });
  }

  private getChannelAddress(channelNumber: number) {
    return { ip: '127.0.0.1', port: '7575' };
  }
}

export default WorldServer;
