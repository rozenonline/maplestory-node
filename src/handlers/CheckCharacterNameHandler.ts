import { getManager } from 'typeorm';
import Client from '../client/client';
import Character from '../models/Character';
import PacketReader from '../packet/PacketReader';
import PacketWriter from '../packet/PacketWriter';
import Opcodes from '../packet/Opcodes';
import StringFactory from '../packet/StringFactory';

const CheckCharacterNameHandler = async (
  client: Client,
  reader: PacketReader
) => {
  const nickname = reader.readString();
  const availability = await checkNicknameAvailability(nickname);

  const packet = new PacketWriter(Opcodes.serverOpcodes.CHAR_NAME_RESPONSE);
  packet.writeString(nickname.toString());
  packet.writeByte(availability ? 0 : 1);
  client.sendPacket(packet);
};

// 캐릭터 이름 검사
async function checkNicknameAvailability(nickname: string): Promise<boolean> {
  const stringFactory = new StringFactory(nickname);

  // 닉네임 예약어
  const RESERVED = ['관리자', '운영자', '메이플', 'GM'];
  if (RESERVED.includes(nickname)) {
    return false;
  }

  // 문자열 길이
  const length = stringFactory.byteLength;
  if (length < 4 && length > 12) {
    return false;
  }

  // 캐릭터 이름 유효성
  if (!nickname.match(/[a-zA-Z0-9가-힣]/)) {
    return false;
  }

  // 중복닉네임 검사
  if (await checkNicknameExists(nickname)) {
    return false;
  }

  return true;
}

// 캐릭터 중복닉네임 여부 확인
async function checkNicknameExists(nickname: string): Promise<boolean> {
  const entityManager = getManager();
  const count = await entityManager.count(Character, { name: nickname });
  return count > 0 ? true : false;
}

export default CheckCharacterNameHandler;
