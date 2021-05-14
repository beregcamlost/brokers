jest.mock('mongodb');
const mongoMiddleware = require('../../app/server/middlewares/mongoMiddleware');
const mockConfig = require('../mocks/configMock');

describe('Test Cases: MongoMiddleware', () => {
  it('Test Case attach db', async () => {
    const ctx = {};
    const handler = () => true;
    await mongoMiddleware(mockConfig)(ctx, handler);
    expect(ctx.db).not.toEqual(undefined);
  });
});
