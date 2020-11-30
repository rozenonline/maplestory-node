import moment from 'moment-timezone';
import { Socket } from 'net';
import config from '../config';
import Account from '../models/Account';
import PacketCrypto from '../packet/PacketCrypto';
import PacketReader from '../packet/PacketReader';
import PacketWriter from '../packet/PacketWriter';
import Opcodes from '../packet/Opcodes';

// 초기 iv값. 랜덤이어도 상관없을듯?
const initialIvReceive = new Uint8Array([0x65, 0x56, 0x12, 0xfd]);
const initialIvSend = new Uint8Array([0x2f, 0xa3, 0x65, 0x43]);

class Client {
  private socket: Socket;

  // DB Account 객체
  public account: Account;

  // 패킷암호화
  private receiveCrypto: PacketCrypto;
  private sendCrypto: PacketCrypto;

  // 핑퐁
  private pingpongTask: NodeJS.Timeout;
  public lastPing: moment.Moment;
  public lastPong: moment.Moment;

  // 접속중인 월드/채널 정보
  public worldId;
  public channelId;

  // 생성자
  constructor(socket: Socket, channelId = -1) {
    this.socket = socket;
    this.channelId = channelId;
    this.receiveCrypto = new PacketCrypto(
      initialIvReceive,
      config.global.mapleVersion
    );
    this.sendCrypto = new PacketCrypto(
      initialIvSend,
      0xffff - config.global.mapleVersion
    );
    console.log(`서버 접속 (${socket.remoteAddress}:${socket.remotePort})`);
    this.sendHandshake();

    // 핑퐁 타이머
    this.pingpongTask = setInterval(() => {
      const pingPacket = new PacketWriter(Opcodes.serverOpcodes.PING);
      this.sendPacket(pingPacket);
      this.lastPing = moment();
    }, 10000);
  }

  // 패킷 수신후 복호화하여 Reader 객체로 리턴
  public readPacket(packet: Buffer): PacketReader | null {
    if (packet.length === 0) {
      return null;
    }

    const headerLength = 4;
    const packetLength = packet.length - headerLength;

    if (packetLength === 0) {
      return null;
    }

    const block = packet.slice(headerLength);

    const data = this.receiveCrypto.decrypt(block);

    console.log(`[RECV] ${data.toString('hex')}\n${data.toString()}`);

    return new PacketReader(data);
  }

  // Writer 객체로 된 패킷을 정렬해서 전송
  public sendPacket(packet: PacketWriter): void {
    const header = this.sendCrypto.getPacketHeader(packet.getBuffer().length);
    this.socket.write(header);

    const data = packet.getBuffer();
    console.log(`[SEND] ${data.toString('hex')}\n${data.toString()}`);

    const encryptedData = this.sendCrypto.encrypt(data);
    this.socket.write(encryptedData);
  }

  // 핸드쉐이크 전송 (in constructor)
  private sendHandshake(): void {
    const packet = new PacketWriter();
    packet.writeShort(13 + '98369'.length);
    packet.writeShort(291);
    packet.writeString('98369');
    packet.writeBytes(initialIvReceive);
    packet.writeBytes(initialIvSend);
    packet.writeByte(1);
    this.socket.write(packet.getBuffer());
  }
}

export default Client;
