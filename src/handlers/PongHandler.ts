import moment from 'moment';
import Client from '../client/client';
import PacketReader from '../packet/PacketReader';

const PongHandler = async (client: Client, reader: PacketReader) => {
  client.lastPong = moment();
};

export default PongHandler;
