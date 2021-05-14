const { statusCodes } = require('../../app/constants/httpStatus');
const errorMiddleware = require('../../app/server/middlewares/errorMiddleware');

describe('Test Cases: ErrorMiddleware', () => {
  it('Test Case Call', async () => {
    const ctx = {
      request: {},
    };
    const app = {
      on: jest.fn((_, callback) => callback({}, ctx)),
      emit: jest.fn(),
    };
    const handlerError = () => {
      throw new Error('Mock Error');
    };
    ctx.app = app;
    try {
      await errorMiddleware(app)(ctx, handlerError);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    expect(ctx.status).toEqual(statusCodes.INTERNAL_SERVER_ERROR);
  });
});
