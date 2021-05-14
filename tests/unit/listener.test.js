jest.mock('../../app/utils/broker', () => ({
  createBroker: jest.fn(),
  createPool: jest.fn(),
}));

const { useListeners } = require('../../app/listeners');
const { createPool } = require('../../app/utils/broker');

describe('Test Cases Listeners Broker', () => {
  it('use listener config empty', () => {
    const pool = useListeners({ options: { brokerConfig: {} } });
    expect(pool).not.toBeDefined();
  });
  it('use listener config null', () => {
    const pool = useListeners();
    expect(pool).not.toBeDefined();
  });
  it('use listener config simple', () => {
    createPool.mockReturnValueOnce({
      addBroker: jest.fn(),
      getBroker: jest.fn(() => ({
        consumer: {
          addListener: jest.fn(),
        },
      })),
      setError: jest.fn(),
    });
    const pool = useListeners({
      options: {
        brokerConfig: {
          kafka: {
            type: 'kafka',
          },
        },
      },
      log: {
        error: jest.fn(),
      },
    });
    expect(pool).toBeDefined();
  });
});
