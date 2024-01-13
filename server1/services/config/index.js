import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { 
  dependenciesKey as dependencies, 
  singletonKey as singleton
} from '../../services/di/index.js';

// I do not use dotenv.config() cause I don't like that
// it populates values into process.env
// So I have to read .env file explicitly

const factory = (fs, dotenv, path) => {
  const dotenvPath = path.resolve(process.cwd(), '.env');
  let parserDotEnvConfig;
  try {
    parserDotEnvConfig = fs.existsSync(dotenvPath)
      ? dotenv.parse(fs.readFileSync(dotenvPath))
      : {};
  } catch (e) {
    e.message = `Failed to load .env config. ${e.message}`;
    throw e;
  }

  const vars = {
    port: process.env.SERVER_PORT || parserDotEnvConfig.SERVER_PORT,
    apiBasePath: process.env.SERVER_API_BASE_PATH || parserDotEnvConfig.SERVER_API_BASE_PATH,
    showErrorStackTrace: (process.env.SHOW_ERROR_STACK_TRACE || parserDotEnvConfig.SHOW_ERROR_STACK_TRACE) === 'true',
  };
  return vars;
};
factory[dependencies] = [fs, dotenv, path];
factory[singleton] = true;
export default factory;
