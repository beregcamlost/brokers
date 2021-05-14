const { statusCodes } = require('../../app/constants/httpStatus');
const statusService = require('../../app/services/statusService');

describe('Test Cases: StatusService', () => {
  it('Test Status Healthy Fail', () => {
    const ctx = {};
    const res = statusService.healthy(ctx);
    expect(res.status).toEqual(statusCodes.SERVICE_UNAVAILABLE);
  });
  it('Test Status Healthy Success', () => {
    const ctx = {
      log: {},
      db: {},
      pool: {},
      config: {},
    };
    const res = statusService.healthy(ctx);
    expect(res.status).toEqual(statusCodes.OK);
  });

  it('Test Status Alive Fail', () => {
    const ctx = {
      log: {},
      db: {
        isConnected: () => false,
      },
      config: {
        mongoUri: 'localhost',
      },
    };
    const res = statusService.alive(ctx);
    expect(res.status).toEqual(statusCodes.SERVICE_UNAVAILABLE);
  });

  it('Test Status Alive Success', () => {
    const ctx = {
      log: {},
      db: {
        isConnected: () => true,
      },
      pool: {
        haveError: () => false,
      },
      config: {
        mongoUri: 'dummy',
      },
    };
    const res = statusService.alive(ctx);
    expect(res.status).toEqual(statusCodes.OK);
  });
  it('Test Status Alive Success Broker', () => {
    const ctx = {
      log: {},
      db: {
        isConnected: () => true,
      },
      pool: {
        haveError: () => false,
      },
      config: {
        mongoUri: 'dummy',
        brokerConfig: {
          kafka: {
            type: 'kafka',
          },
        },
      },
    };
    const res = statusService.alive(ctx);
    expect(res.status).toEqual(statusCodes.OK);
    expect(statusService.healthy(ctx).status).toEqual(statusCodes.OK);
  });
  it('Test Status Alive Success Broker skip', () => {
    const ctx = {
      log: {},
      db: {
        isConnected: () => true,
      },
      pool: {
        haveError: () => false,
      },
      config: {},
    };
    const res = statusService.alive(ctx);
    expect(res.status).toEqual(statusCodes.OK);
    expect(statusService.healthy(ctx).status).toEqual(statusCodes.OK);
  });
  it('Test Check not config', () => {
    const ctx = {
      log: {},
      config: {
        mongoUri: 'dummy',
      },
    };
    const res = statusService.alive(ctx);
    expect(res.status).toEqual(statusCodes.SERVICE_UNAVAILABLE);
    expect(statusService.healthy(ctx).status).toEqual(
      statusCodes.SERVICE_UNAVAILABLE,
    );
  });
  it('Test Check fail', () => {
    const ctx = {
      log: {},
      config: {
        mongoUri: 'dummy',
        brokerConfig: {
          kafka: {
            type: 'kafka',
          },
        },
      },
    };
    const res = statusService.alive(ctx);
    expect(res.status).toEqual(statusCodes.SERVICE_UNAVAILABLE);
    expect(statusService.healthy(ctx).status).toEqual(
      statusCodes.SERVICE_UNAVAILABLE,
    );
  });
});
