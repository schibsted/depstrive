const {
  STSClient,
  AssumeRoleCommand,
  GetCallerIdentityCommand,
} = require('@aws-sdk/client-sts');
const { execSync } = require('child_process');
const { logger: getLogger } = require('../logger');

const logger = getLogger(module);

async function assumeRole(roleArn) {
  const sts = new STSClient();
  const params = {
    RoleArn: roleArn,
    RoleSessionName: 'depstrive',
  };

  const command = new AssumeRoleCommand(params);
  const assumedRole = await sts.send(command);

  logger.info(
    `Assumed role ${assumedRole.AssumedRoleUser.Arn}. Expires ${assumedRole.Credentials.Expiration}`,
  );

  const credentials = {
    accessKeyId: assumedRole.Credentials.AccessKeyId,
    secretAccessKey: assumedRole.Credentials.SecretAccessKey,
    sessionToken: assumedRole.Credentials.SessionToken,
  };
  return credentials;
}

async function getCallerIdentity() {
  const sts = new STSClient();
  const params = {};
  const command = new GetCallerIdentityCommand(params);
  const callerIdentity = await sts.send(command);

  return callerIdentity;
}

function credentialsToEnvs(creds) {
  const envs = {
    AWS_ACCESS_KEY_ID: creds.accessKeyId,
    AWS_SECRET_ACCESS_KEY: creds.secretAccessKey,
    AWS_SESSION_TOKEN: creds.sessionToken,
  };

  return envs;
}

async function execWithRole(role, command) {
  const proCreds = await assumeRole(role);
  const env = { ...process.env, ...credentialsToEnvs(proCreds) };
  let output;
  try {
    output = execSync(command, {
      stdio: [0, 1, 2],
      cwd: process.cwd(),
      env,
    });
  } catch (err) {
    logger.error(`Command has exited with error: ${err}`);
    return Promise.reject(err);
  }

  return Promise.resolve(output);
}

module.exports = {
  assumeRole,
  getCallerIdentity,
  credentialsToEnvs,
  execWithRole,
};
