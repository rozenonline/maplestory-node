export default {
  channelEnabled: Boolean(process.env.channelEnabled || true),
  channelPorts: process.env.channelPorts || '7575,7576',
  worldHost: process.env.worldHost || '127.0.0.1'
};
