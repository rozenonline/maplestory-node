import Client from '../../client/client';
import PacketReader from '../../packet/PacketReader';
import { isChannelServerActive } from '../../server/WorldClient';

const LoggedInHandler = async (client: Client, reader: PacketReader) => {
  // 채널서버가 ON 상태인지 확인합니다.
  console.log('채널', client.channelId, '번 체크 시작');
  await isChannelServerActive(client.channelId);
};

export default LoggedInHandler;
