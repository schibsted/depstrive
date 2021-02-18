#!/usr/bin/env node

const yargs = require('yargs');
const { setLogLevel, getInstance } = require('../lib/logger');

const packageJson = require('../package.json');

const logger = getInstance({ id: 'main' });

const main = () => {
  const { argv } = yargs
    .scriptName(packageJson.name)
    .middleware((opts) => {
      logger.info(`** Running ${packageJson.name} version ${packageJson.version} ...`);
      setLogLevel(opts.logLevel);
    })
    .commandDir('cmds', { recurse: true })
    .options({
      'log-level': {
        alias: 'l',
        desc: 'Log Level',
        choices: ['debug', 'info', 'warn', 'error'],
        default: 'error',
      },
    })
    .alias('h', 'help')
    .demandCommand()
    .showHelpOnFail(true)
    .recommendCommands()
    .strict();

  return argv;
};

const runAsScript = require.main === module;
if (runAsScript) {
  main();
}
