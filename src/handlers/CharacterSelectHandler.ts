import Client from '../client/client';
import Opcodes from '../packet/Opcodes';
import PacketReader from '../packet/PacketReader';
import PacketWriter from '../packet/PacketWriter';
import { getChannelServer } from '../server/WorldClient';

const CharacterSelectHandler = async (client: Client, reader: PacketReader) => {
  const characterId = reader.readUInt();

  const channel = await getChannelServer();

  const packet = new PacketWriter(Opcodes.serverOpcodes.SERVER_IP);
  packet.writeUShort(0);
  packet.writeUByte(channel.ip.split('.')[0]); // 채널서버 아이피
  packet.writeUByte(channel.ip.split('.')[1]);
  packet.writeUByte(channel.ip.split('.')[2]);
  packet.writeUByte(channel.ip.split('.')[3]);
  packet.writeUShort(channel.port); // 포트
  packet.writeUInt(characterId);
  packet.writeUByte(0);
  packet.writeUInt(0);
  client.sendPacket(packet);
};

export default CharacterSelectHandler;
