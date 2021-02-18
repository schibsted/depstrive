const { getInstance: getLoggerInstance } = require('./logger');
const aws = require('./aws/assumeRole');

const logger = getLoggerInstance(module);
const hello = (name) => {
  logger.info(`Your ${name} module is installed properly!`);
  return true;
};

module.exports = { hello, aws };
