const awsAssumeRole = require('../../../lib/aws/assumeRole');

// Mocked in __mocks__
jest.mock('aws-sdk');
jest.mock('child_process', () => ({
  execSync: jest.fn().mockImplementation(() => {
    throw new Error('command not found or returned an error');
  }),
}));

describe('Module', () => {
  it('throws an error when sub-command is failing', async () => {
    expect(awsAssumeRole.execWithRole(
      'arn:::exec-with-role',
      'this-command-throws-error',
    )).rejects.toThrow();
  });
});
