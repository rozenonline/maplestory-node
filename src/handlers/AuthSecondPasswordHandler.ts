import { getManager } from 'typeorm';
import Client from '../client/client';
import Account from '../models/Account';
import Opcodes from '../packet/Opcodes';
import PacketReader from '../packet/PacketReader';
import PacketWriter from '../packet/PacketWriter';

const AuthSecondPasswordHandler = async (
  client: Client,
  reader: PacketReader
) => {
  const mode = reader.readUByte(); // 0: 2차비번삭제, 1: 2차비번설정
  reader.skip(4);
  const password = reader.readString();
  if (mode === 1) {
    if (client.account.secondpassword !== null) {
      // Todo: 클라이언트 종료후 밴 (Invalid Packet)
      return;
    }
    if (password.length >= 4 && password.length <= 16) {
      client.account.secondpassword = password;
      await getManager().save(Account, client.account);
      const packet = new PacketWriter(Opcodes.serverOpcodes.SECONDPW_ERROR);
      packet.writeUByte(1);
      packet.writeUByte(0x00);
      return client.sendPacket(packet);
    } else {
      const packet = new PacketWriter(Opcodes.serverOpcodes.SECONDPW_ERROR);
      packet.writeUByte(1);
      packet.writeUByte(0x14);
      return client.sendPacket(packet);
    }
  } else {
    if (client.account.secondpassword === null) {
      // Todo: 클라이언트 종료후 밴 (Invalid Packet)
      return;
    }
    if (password === client.account.secondpassword) {
      client.account.secondpassword = null;
      await getManager().save(Account, client.account);
      const packet = new PacketWriter(Opcodes.serverOpcodes.SECONDPW_ERROR);
      packet.writeUByte(0);
      packet.writeUByte(0x00);
      return client.sendPacket(packet);
    } else {
      const packet = new PacketWriter(Opcodes.serverOpcodes.SECONDPW_ERROR);
      packet.writeUByte(0);
      packet.writeUByte(0x14);
      return client.sendPacket(packet);
    }
  }
};

export default AuthSecondPasswordHandler;
