import Client from '../client/client';
import PacketReader from '../packet/PacketReader';
import PacketWriter from '../packet/PacketWriter';
import Opcodes from '../packet/Opcodes';

const CharacterListRequestHandler = async (
  client: Client,
  reader: PacketReader
) => {
  reader.skip(1);
  const worldId = reader.readByte();
  const channelId = reader.readByte() + 1;

  client.worldId = worldId;
  client.channelId = channelId;

  // 캐릭터 로딩
  await client.account.loadCharacters(worldId);

  const packet = new PacketWriter(Opcodes.serverOpcodes.CHARLIST);
  packet.writeByte(0);
  packet.writeInt(0);
  packet.writeByte(client.account.characters.length); // character 수

  // 캐릭터 정보
  for (const character of client.account.characters) {
    // addCharStats
    packet.writeInt(character.id);
    packet.writeString(character.name, 13);
    packet.writeByte(character.gender ? 1 : 0);
    packet.writeByte(character.skin);
    packet.writeInt(character.face);
    packet.writeInt(character.hair);
    for (let i = 0; i < 8; i++) packet.writeByte(0); // 제로바이트 8개
    packet.writeByte(character.level);
    packet.writeShort(character.job);
    packet.writeShort(character.str);
    packet.writeShort(character.dex);
    packet.writeShort(character.int);
    packet.writeShort(character.luk);
    packet.writeShort(character.hp);
    packet.writeShort(character.maxHp);
    packet.writeShort(character.mp);
    packet.writeShort(character.maxMp);
    packet.writeShort(character.sp);
    packet.writeShort(character.ap);
    packet.writeInt(character.exp);
    packet.writeShort(character.fame);
    packet.writeInt(character.mapId);
    packet.writeByte(character.spawnPoint);

    // addCharLook
    packet.writeByte(character.gender ? 1 : 0);
    packet.writeByte(character.skin);
    packet.writeInt(character.face);
    packet.writeByte(0); // mega???????
    packet.writeInt(character.hair);

    // Calculate Equipments
    const equipments = [];
    const maskedEquipments = [];
    for (const ivItem of character.inventoryItems) {
      const itemId = ivItem.itemId;
      if (ivItem.position < -127) continue; // not visible
      const position = ivItem.position * -1;
      if (position < 100) {
        equipments.push({ position, itemId });
      } else if (position > 100 && position != 111) {
        maskedEquipments.push({ position: position - 100, itemId });
        equipments.push({ position: position - 100, itemId });
      }
    }

    // Equipments
    for (const equipment of equipments) {
      packet.writeByte(equipment.position);
      packet.writeInt(equipment.itemId);
    }
    packet.writeByte(-1); // end of visible items

    // Masked Equipment
    for (const maskedEquipment of maskedEquipments) {
      packet.writeByte(maskedEquipment.position);
      packet.writeInt(maskedEquipment.itemId);
    }
    packet.writeByte(-1); //end of masked items

    // etc
    packet.writeInt(0); // cweapon?? 일단 0
    packet.writeInt(0); // ...pet??????

    // ranking
    packet.writeByte(0); // 랭킹표시 1 미표시 0 (1일시 추가패킷 write)
  }

  // 2nd password
  packet.writeByte(client.account.secondpassword ? 1 : 2); // 1: 2차비번있음 2: 없음
  packet.writeByte(0);

  // etc
  packet.writeInt(3); // 캐릭터 슬롯수

  client.sendPacket(packet);
};

export default CharacterListRequestHandler;
