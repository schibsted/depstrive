const { getInstance: getLoggerInstance } = require('../../lib/logger');
const { execWithRole } = require('../../lib/aws/assumeRole');

const logger = getLoggerInstance(module);

exports.command = 'execWithAssume <cmd...>';
exports.desc = 'Run command with AWS role assumed.';
exports.builder = {
  'role-arn': {
    alias: 'r',
    desc: 'AWS Assume Role arn',
    required: true,
  },
};
exports.handler = (argv) => {
  const cmd = argv.cmd.join(' ');

  logger.info('Running command with assumed role');
  execWithRole(argv.roleArn, cmd)
    .then(() => {
      logger.info('done');
    })
    .catch((reason) => {
      logger.error(reason);
      process.exit(1);
    });
};
