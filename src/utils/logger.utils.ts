import { LOG_TIMESTAMP_FORMAT } from '../constants/common.constants';
const pino = require('pino');

const logger = pino({
  level: 'trace',
  prettifier: true && require('pino-pretty'),
  base: null,
  prettyPrint: {
    translateTime: LOG_TIMESTAMP_FORMAT,
    colorize: true,
    levelFirst: true
  }
});

export const Logger = logger;