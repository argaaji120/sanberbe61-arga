import mongoose from 'mongoose';
import { DATABASE_URL } from './env';

const connect = async () => {
  try {
    await mongoose.connect(DATABASE_URL, { dbName: 'sanber-express' });
    console.log('Database connected');
    return 'Database connected';
  } catch (error) {
    const err = error as Error;
    console.error(`Failed to connect database: ${err.message}`);
    return error;
  }
};

export default connect;
