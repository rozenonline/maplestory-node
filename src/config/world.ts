export default {
  worldEnabled: Boolean(process.env.worldEnabled || true),
  worldHost: process.env.worldHost || '127.0.0.1',
  worldPort: Number(process.env.worldPort || 9393),
  channelServers: JSON.parse(process.env.channelServers) || [],
  userLimit: Number(process.env.userLimit || 500),
  expRate: Number(process.env.expRate || 1),
  mesoRate: Number(process.env.mesoRate || 1),
  dropRate: Number(process.env.dropRate || 1),
  bossDropRate: Number(process.env.bossDropRate || 1)
};
