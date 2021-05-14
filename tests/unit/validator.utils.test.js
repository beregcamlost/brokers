const joi = require('joi');
const httpStatus = require('../../app/constants/httpStatus');
const { useValidation } = require('../../app/utils/validator');

describe('Test Cases: validator', () => {
  it('Test Validate Fail', () => {
    const ctx = {
      body: {

      },
      log: {
        warn: jest.fn(),
      },
    };
    const scheme = joi.object({
      test: joi.required(),
    });
    useValidation([{
      property: 'body',
      scheme,
    }], (c) => c)(ctx);
    expect(ctx.status).toEqual(httpStatus.statusCodes.BAD_REQUEST);
  });

  it('Test Validate success', () => {
    const ctx = {
      request: {
        body: {
          test: 'test',
        },
      },
      body: {
        test: 'test',
      },
      log: {
        warn: jest.fn(),
      },
    };
    const scheme = joi.object({
      test: joi.required(),
    });
    useValidation([{
      property: 'request.body',
      scheme,
    }], (context) => {
      context.status = httpStatus.statusCodes.OK;
    })(ctx);
    expect(ctx.status).toEqual(httpStatus.statusCodes.OK);
  });

  it('Test Validate fail multiple', () => {
    const ctx = {
      request: {
        body: {},
      },
      body: {
      },
      log: {
        warn: jest.fn(),
      },
    };
    const scheme = joi.object({
      test: joi.required(),
    });
    useValidation([{
      property: 'request.body',
      scheme,
    },
    {
      property: 'body',
      scheme,
    }], (context) => {
      context.status = httpStatus.statusCodes.OK;
    })(ctx);
    expect(ctx.status).toEqual(httpStatus.statusCodes.BAD_REQUEST);
  });

  it('Test Validate fail not data', () => {
    const ctx = {
      request: {
        bodys: {},
      },
      body: {
      },
      log: {
        warn: jest.fn(),
      },
    };
    const scheme = joi.object({
      test: joi.required(),
    });
    useValidation([{
      property: 'request.body',
      scheme,
    },
    {
      property: 'body',
      scheme,
    }], (context) => {
      context.status = httpStatus.statusCodes.OK;
    })(ctx);
    expect(ctx.status).toEqual(httpStatus.statusCodes.BAD_REQUEST);
  });
});
