const awsAssumeRole = require('../../../lib/aws/assumeRole');

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
  execSync: jest.fn().mockImplementation(() => {
    throw new Error('command not found or returned an error');
  }),
}));

describe('Module', () => {
  it('throws an error when sub-command is failing', async () => {
    expect(
      awsAssumeRole.execWithRole(
        'arn:::exec-with-role',
        'this-command-throws-error',
      ),
    ).rejects.toThrow();
  });
});
