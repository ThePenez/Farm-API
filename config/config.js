/* eslint-disable quote-props */
import dotenv from 'dotenv';

dotenv.config();

const { DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

const myDatabase = {
  'development': {
    'username': DB_USERNAME,
    'password': DB_PASSWORD,
    'database': 'database_development',
    'host': DB_HOST,
    'dialect': 'postgres',
  },
  'test': {
    'username': DB_USERNAME,
    'password': DB_PASSWORD,
    'database': 'database_test',
    'host': DB_HOST,
    'dialect': 'postgres',
  },
  'production': {
    'username': DB_USERNAME,
    'password': DB_PASSWORD,
    'database': 'database_production',
    'host': DB_HOST,
    'dialect': 'postgres',
  },
};

export default myDatabase;
