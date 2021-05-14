const loggerMiddleware = require('../../app/server/middlewares/loggerMiddleware');
const mockConfig = require('../mocks/configMock');

describe('Test Cases: MonitorMiddleware', () => {
  it('Test Case log request', async () => {
    const ctx = {
      log: {
        info: jest.fn(),
      },
      request: {},
      response: {},
    };
    const handler = () => true;
    await loggerMiddleware(mockConfig)(ctx, handler);
    expect(loggerMiddleware.log).not.toBeDefined();
  });
});
