const getLogger = require('../../lib/logger');
const depstrive = require('../../lib/index');

describe('Module', () => {
  beforeAll(() => {
    const allLoggers = getLogger.getAllInstances();
    Object.keys(allLoggers).forEach((key) => {
      allLoggers[key].removeAllListeners();
    });
  });
  it('should return Hello World function', () => {
    expect(depstrive.hello('curious')).toBe(true);
  });
});
