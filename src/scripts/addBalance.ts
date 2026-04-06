import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env.local') });

mongoose.connect(process.env.MONGODB_URI as string);

const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', UserSchema);

async function run() {
  const email = 'huanfpt03@gmail.com';
  const result = await User.updateOne(
    { email: email },
    { $set: { balance: 10000000, name: 'DUONG TUANH' } }
  );
  console.log('Update result:', result);
  process.exit(0);
}

run().catch(console.error);
