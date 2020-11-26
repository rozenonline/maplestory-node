import 'reflect-metadata';
import config from './config';
import { createConnection } from 'typeorm';
import WorldServer from './server/World';
import ServerFactory from './server/ServerFactory';

// DB 연결
createConnection({
  type: 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.database,
  entities: ['src/models/*.ts'],
  synchronize: true,
  logging: false,
  connectTimeout: 5000
})
  .then((connection) => {
    console.log(`DB Connection has established`);

    // 월드 서버 시작
    if (config.world.worldEnabled) {
      new WorldServer();
    }

    // 로그인 서버 시작
    if (config.login.loginEnabled) {
      const loginPort = config.login.loginPort;
      ServerFactory().listen(loginPort, () => {
        console.log(`[Login] Server on port ${loginPort}`);
      });
    }

    // 채널서버 시작
    if (config.channel.channelEnabled) {
      let count = 0;
      for (const port of config.channel.channelPorts.split(',')) {
        ServerFactory().listen(Number(port), () => {
          console.log(`[Channel] Server-${count++} on port ${port}`);
        });
      }
    }
  })
  .catch((error) => {
    console.log(`Unable to connect to database!`);
    console.log(error);
    process.exit();
  });
