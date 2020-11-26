import net from 'net';
import config from '../config';

export const getChannelServer = async () => {
  return await executeFunctionRemote('getChannelAddress(0);');
};

const executeFunctionRemote = async (functionHead: string) => {
  const worldClient = createWorldClient();
  worldClient.write(functionHead);
  const result = await new Promise((resolve) => {
    worldClient.on('data', (data) => {
      resolve(data);
    });
  });
  worldClient.destroy();
  try {
    return JSON.parse(result.toString());
  } catch (error) {
    return result.toString();
  }
};

const createWorldClient = () => {
  const worldClient = new net.Socket();

  worldClient.connect(config.world.worldPort, config.world.worldHost);

  worldClient.on('error', (error) => {
    console.log(error);
    process.exit(1);
  });

  return worldClient;
};
