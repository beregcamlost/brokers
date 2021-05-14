jest.mock('koa');
const configMiddleware = require('../../app/server/middlewares/configMiddleware');

describe('Test Cases: ConfigMiddleware', () => {
  it('Test Call Config', async () => {
    const ctx = {};
    const next = () => 1;
    const config = {};
    await configMiddleware(config)(ctx, next);
    expect(ctx.config).not.toEqual(undefined);
  });
});
