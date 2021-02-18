

module.exports.STS = jest.fn().mockImplementation(() => ({
  assumeRole: jest.fn().mockImplementation(params => ({
    promise: () => Promise.resolve({
      AssumedRoleUser: {
        Arn: params.RoleArn,
      },
      Credentials: {
        AccessKeyId: 'akid-1',
        SecretAccessKey: 'sak-2',
        SessionToken: 'st-3',
        Expiration: 'today',
      },
    }),
  })),
  getCallerIdentity: jest.fn().mockImplementation(() => ({
    promise: () => Promise.resolve({
      ResponseMetadata: { RequestId: 'REQUID' },
      UserId: 'AWS_UID',
      Account: '123456789012',
      Arn: 'arn:aws:sts::123456789012:assumed-role/some-user',
    }),
  })),
}));
