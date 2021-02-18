const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = loadingModule => createLogger({
  format: format.combine(
    format.label({ label: path.basename(loadingModule.id) }),
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`,
    ),
  ),
  transports: [new transports.Console()],
  exceptionHandlers: [new transports.Console()],
});

const instances = {};

const getInstance = (loadingModule) => {
  if (!instances[loadingModule.id]) {
    instances[loadingModule.id] = logger(loadingModule);
  }
  return instances[loadingModule.id];
};

const setLogLevel = (level) => {
  Object.keys(instances).forEach((key) => {
    instances[key].level = level;
  });
};

const getAllInstances = () => instances;

module.exports = {
  logger: getInstance,
  setLogLevel,
  getInstance,
  getAllInstances,
};
