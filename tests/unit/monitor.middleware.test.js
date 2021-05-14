const monitorMiddleware = require('../../app/server/middlewares/monitorMiddleware');
const mockConfig = require('../mocks/configMock');

describe('Test Cases: MonitorMiddleware', () => {
  it('Test Case log request', async () => {
    const ctx = {
      log: {
        info: jest.fn(),
      },
      request: {
        path: '',
      },
      response: {},
    };
    const spy = jest.spyOn(ctx.log, 'info');
    const handler = () => true;
    await monitorMiddleware(mockConfig)(ctx, handler);
    expect(spy).toHaveBeenCalled();
  });
});
