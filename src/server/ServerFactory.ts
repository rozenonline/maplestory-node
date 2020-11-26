import net from 'net';
import Client from '../client/client';
import PacketHandler from '../packet/PacketHandler';
import Opcodes from '../packet/Opcodes';

const ServerFactory = () => {
  const server = net.createServer();

  server.on('connection', async (socket) => {
    const client = new Client(socket);

    socket.on('data', async (data) => {
      const reader = client.readPacket(data);

      if (reader) {
        try {
          const opcode = reader.readUShort();
          const handler = PacketHandler.getHandler(opcode);
          if (!handler) {
            const opcodeTitle = Opcodes.getClientOpcodeByValue(opcode);
            const opcodeValue =
              '0x' + ('00' + opcode.toString(16).toUpperCase()).slice(-2);
            throw new Error(
              `${opcodeTitle} (${opcodeValue}) 에 대한 핸들러를 찾을 수 없습니다`
            );
          }
          await handler(client, reader);
        } catch (err) {
          console.log(err);
        }
      }
    });
  });

  server.on('error', (error) => {
    console.log(error);
    process.exit(1);
  });

  return server;
};

export default ServerFactory;
