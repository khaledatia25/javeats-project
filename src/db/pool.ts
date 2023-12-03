import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dp_config: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 300,
  idleTimeoutMillis: 200,
  max: 200,
};

const pool: Pool = new Pool(dp_config);

pool.on('connect', () => {
  console.log('Database connected');
});

pool.on('remove', () => {
  console.log('Database connection removed');
});

export default pool;
