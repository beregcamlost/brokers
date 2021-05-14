jest.mock('koa');
jest.mock('dotenv');
const { startServer, stopServer } = require('../../app/server');
const { loadConfig } = require('../../app/config');

describe('Test Case Server', () => {
  it('Server Start init', () => {
    const config = loadConfig({ get: () => undefined });
    const app = startServer(config);
    expect(app).not.toEqual(undefined);
    const spy = jest.spyOn(app, 'removeAllListeners');
    stopServer();
    expect(spy).toHaveBeenCalled();
  });
});
