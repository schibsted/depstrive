const AWS = require('aws-sdk');
const { execSync } = require('child_process');
const { logger: getLogger } = require('../logger');

const logger = getLogger(module);

async function assumeRole(roleArn) {
  const params = {
    RoleArn: roleArn,
    RoleSessionName: 'depstrive',
  };

  const assumedRole = await new AWS.STS().assumeRole(params).promise();
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
  const params = {};
  const callerIdentity = await new AWS.STS()
    .getCallerIdentity(params)
    .promise();

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
  const env = Object.assign({}, process.env, credentialsToEnvs(proCreds));

  return execSync(command, { stdio: [0, 1, 2], cwd: process.cwd(), env });
}

module.exports = {
  assumeRole,
  getCallerIdentity,
  credentialsToEnvs,
  execWithRole,
};
