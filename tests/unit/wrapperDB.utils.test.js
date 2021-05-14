jest.mock('mongodb');
const mongoMocks = require('../mocks/mongoMock');
const { mockConfigSimple } = require('../mocks/configMock');
const wrapper = require('../../app/utils/wrapperDB');

describe('Test Cases: wrapperDB', () => {
  /**
   * @type {import("mongodb").MongoClient}
   */
  let client = {};

  beforeEach(() => {
    client = wrapper.connect(mockConfigSimple);
  });
  it('Test Find One', async () => {
    client.db.mockReturnValueOnce(mongoMocks.mockFindOne);
    const data = await wrapper.findOne('test', {});
    expect(data).not.toEqual(undefined);
  });
  it('Test Find', async () => {
    client.db.mockReturnValueOnce(mongoMocks.mockFind);
    const data = await wrapper.find('test', {});
    expect(data).not.toEqual(undefined);
  });
  it('Test Create', async () => {
    client.db.mockReturnValueOnce(mongoMocks.mockInsertOne);
    const data = await wrapper.create({ test: 'test' });
    expect(data).not.toEqual(undefined);
  });

  it('Test Create Batch', async () => {
    client.db.mockReturnValueOnce(mongoMocks.mockInsertBatch);
    const data = await wrapper.createBatch({ test: 'test' });
    expect(data).not.toEqual(undefined);
  });

  it('Test Update One', async () => {
    client.db.mockReturnValueOnce(mongoMocks.mockUpdateOne);
    const data = await wrapper.update({ field: 'value' }, { test: 'test' });
    expect(data).not.toEqual(undefined);
  });

  it('Test Update Batch', async () => {
    client.db.mockReturnValueOnce(mongoMocks.mockUpdateBatch);
    const data = await wrapper.updateBatch({ field: 'value' }, { test: 'test' });
    expect(data).not.toEqual(undefined);
  });
});
