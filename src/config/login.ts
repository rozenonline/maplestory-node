export default {
  loginEnabled: Boolean(process.env.loginEnabled || true),
  loginPort: Number(process.env.loginPort || 8484),
  worldHost: process.env.worldHost || '127.0.0.1'
};
