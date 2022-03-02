const awsAssumeRole = require('../../../lib/aws/assumeRole');

// Mocked in __mocks__
jest.mock('@aws-sdk/client-sts', () => ({
  STSClient: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockImplementation((params) => {
      switch (params.type) {
        case 'AssumeRoleCommand':
          return Promise.resolve({
            AssumedRoleUser: {
              Arn: params.RoleArn,
            },
            Credentials: {
              AccessKeyId: 'akid-1',
              SecretAccessKey: 'sak-2',
              SessionToken: 'st-3',
              Expiration: 'today',
            },
          });
        case 'GetCallerIdentityCommand':
          return Promise.resolve({
            ResponseMetadata: { RequestId: 'REQUID' },
            UserId: 'AWS_UID',
            Account: '123456789012',
            Arn: 'arn:aws:sts::123456789012:assumed-role/some-user',
          });
        default:
          return Promise.reject(new Error('Unimplemented'));
      }
    }),
  })),
  AssumeRoleCommand: jest.fn().mockImplementation((params) => ({
    type: 'AssumeRoleCommand',
    params,
  })),
  GetCallerIdentityCommand: jest.fn().mockImplementation((params) => ({
    type: 'GetCallerIdentityCommand',
    params,
  })),
}));

jest.mock('child_process', () => ({
  execSync: jest.fn().mockImplementation((command, params) => ({
    command,
    params,
  })),
}));

describe('Module', () => {
  it('assumes the role', async () => {
    const assumed = await awsAssumeRole.assumeRole('arn:::some-arn');
    expect(assumed).toHaveProperty('accessKeyId', 'akid-1');
    expect(assumed).toHaveProperty('secretAccessKey', 'sak-2');
    expect(assumed).toHaveProperty('sessionToken', 'st-3');
  });

  it('translates assumed credentials into environment variables like map', async () => {
    const assumed = await awsAssumeRole.assumeRole('arn:::other-arn');
    const translated = awsAssumeRole.credentialsToEnvs(assumed);

    expect(translated).toHaveProperty('AWS_ACCESS_KEY_ID', 'akid-1');
    expect(translated).toHaveProperty('AWS_SECRET_ACCESS_KEY', 'sak-2');
    expect(translated).toHaveProperty('AWS_SESSION_TOKEN', 'st-3');
  });

  it('gets caller identity map', async () => {
    const callerIdentity = await awsAssumeRole.getCallerIdentity();
    expect(callerIdentity).toHaveProperty('Account');
    expect(callerIdentity).toHaveProperty('Arn');
    expect(callerIdentity).toHaveProperty('UserId');

    expect(callerIdentity.Account).not.toBeNull();
    expect(callerIdentity.Arn).not.toBeNull();
    expect(callerIdentity.UserId).not.toBeNull();
  });

  it('execs command with assumed role', async () => {
    const mockExecParams = await awsAssumeRole.execWithRole(
      'arn:::exec-with-role',
      'echo Hello World',
    );
    expect(mockExecParams).toHaveProperty('command', 'echo Hello World');
    expect(mockExecParams).toHaveProperty('params');
    expect(mockExecParams.params).toHaveProperty('env');
    expect(mockExecParams.params.env).toHaveProperty(
      'AWS_ACCESS_KEY_ID',
      'akid-1',
    );
    expect(mockExecParams.params.env).toHaveProperty(
      'AWS_SECRET_ACCESS_KEY',
      'sak-2',
    );
    expect(mockExecParams.params.env).toHaveProperty(
      'AWS_SESSION_TOKEN',
      'st-3',
    );
  });
});
