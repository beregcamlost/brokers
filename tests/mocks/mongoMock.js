const mockInsertOne = {
  collection: jest.fn(() => ({
    insertOne: jest.fn(() => (Promise.resolve({
    }))),
  })),
};

const mockUpdateOne = {
  collection: jest.fn(() => ({
    updateOne: jest.fn(() => (Promise.resolve({
    }))),
  })),
};

const mockUpdateBatch = {
  collection: jest.fn(() => ({
    updateMany: jest.fn(() => (Promise.resolve([]))),
  })),
};

const mockInsertBatch = {
  collection: jest.fn(() => ({
    insertMany: jest.fn(() => (Promise.resolve([]))),
  })),
};

const mockFind = {
  collection: jest.fn(() => ({
    find: jest.fn(() => ({
      toArray: jest.fn(() => Promise.resolve([])),
    })),
  })),
};

const mockFindOne = {
  collection: jest.fn(() => ({
    findOne: jest.fn(() => Promise.resolve({ test: 1 })),
  })),
};

module.exports = {
  mockInsertOne,
  mockInsertBatch,
  mockUpdateOne,
  mockUpdateBatch,
  mockFind,
  mockFindOne,
};
