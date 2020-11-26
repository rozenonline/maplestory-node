import { read } from 'fs';
import { getManager } from 'typeorm';
import Client from '../client/client';
import Character from '../models/Character';
import Opcodes from '../packet/Opcodes';
import PacketReader from '../packet/PacketReader';
import PacketWriter from '../packet/PacketWriter';

const DeleteCharacterHandler = async (client: Client, reader: PacketReader) => {
  const worldId = reader.readUByte(); // 아직모르겠는데 worldId 값으로 추정**
  const password = reader.readUInt(); // 2차비밀번호 일단 무시
  const characterId = reader.readUInt();

  let success = false;
  for (const character of client.account.characters) {
    if (character.id === characterId) {
      await getManager().delete(Character, characterId);
      success = true;
    }
  }

  const packet = new PacketWriter(Opcodes.serverOpcodes.DELETE_CHAR_RESPONSE);
  packet.writeUInt(characterId);
  packet.writeUByte(success ? 1 : 0); // success 0, fail 1
  return client.sendPacket(packet);
};

export default DeleteCharacterHandler;
