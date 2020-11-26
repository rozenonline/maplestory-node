import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
} else {
  dotenv.config();
}

import global from './global';
import database from './database';
import world from './world';
import login from './login';
import channel from './channel';

export default { database, global, world, login, channel };
