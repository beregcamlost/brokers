jest.mock('kafkajs');
jest.mock('@google-cloud/pubsub');
jest.mock('@azure/service-bus');
import kafkajs from 'kafkajs';
import * as pubsub from '@google-cloud/pubsub';
import * as servicebus from '@azure/service-bus';
import {
  createPool,
  createBroker,
} from '../../src'

describe('Test Cases: Broker utils', () => {
  it('Test Case Create Broker Kafka', () => {
    const pool = createPool();
    expect(pool).toBeDefined();
    const broker = createBroker({type: 'kafka', kafkaOption: {}});
    expect(broker.haveError()).toEqual(false);
    const brokerPubSub = createBroker({type: 'pubsub'});
    expect(brokerPubSub.haveError()).toEqual(false);
    const brokerServiceBus = createBroker({
      type: 'servicebus',
      serviceBusStrCnn: 'cnn',
    });
    expect(brokerServiceBus.haveError()).toEqual(false);
    const brokerFail = createBroker({type: null});
    expect(brokerFail.haveError()).toBeDefined();
  });
  it('Test Case Create Broker Kafka, check', async () => {
    const pool = createPool();
    expect(pool).toBeDefined();
    const producerKafkaMock = jest.fn();
    producerKafkaMock.mockReturnValueOnce({
      connect: jest.fn(() => Promise.resolve()),
      disconnect: jest.fn(() => Promise.resolve()),
    });
    kafkajs.Kafka.mockImplementationOnce(() => ({
      producer: producerKafkaMock,
    }));
    const broker = createBroker({type: 'kafka', kafkaOption: {}});
    const isCheckKafka = await broker.check();
    expect(isCheckKafka).toEqual(true);
    pubsub.PubSub.mockImplementationOnce(() => ({
      auth: {
        getAccessToken: jest.fn(() => Promise.resolve()),
      },
    }));
    const brokerPubSub = createBroker({type: 'pubsub'});
    const isCheckPubSub = await brokerPubSub.check();
    expect(isCheckPubSub).toEqual(true);
    const brokerServiceBus = createBroker({
      type: 'servicebus',
      serviceBusStrCnn: 'cnn',
    });
    const isCheckServiceBus = await brokerServiceBus.check();
    expect(isCheckServiceBus).toEqual(true);
  });
  it('Test Case Create Broker Kafka, check fail', async () => {
    const pool = createPool();
    expect(pool).toBeDefined();
    const broker = createBroker({type: 'dummy', kafkaOption: {}});
    expect(() => {
      pool.getBroker('kafka');
    }).toThrow();
    return broker
      .check()
      .then(() => {
        jest.fail('correct running');
      })
      .catch((err) => {
        expect(err.message).toEqual('Broker client not found');
      });
  });
  it('Test Case Create Broker Kafka, publish', async () => {
    const pool = createPool();
    expect(pool).toBeDefined();
    pool.setError('err');
    const producerKafkaMock = jest.fn();
    producerKafkaMock.mockReturnValueOnce({
      connect: jest.fn(() => Promise.resolve()),
      send: jest.fn(),
      disconnect: jest.fn(() => Promise.resolve()),
      on: jest.fn()
    });
    kafkajs.Kafka.mockImplementationOnce(() => ({
      producer: producerKafkaMock,
    }));
    const broker = createBroker({type: 'kafka', kafkaOption: {}});
    broker.setError('err');
    pool.addBroker('kafka', broker);
    const record = await pool.getBroker('kafka').producer.publish('', {});
    expect(record).not.toBeDefined();
    pubsub.PubSub.mockImplementationOnce(() => ({
      topic: jest.fn(() => ({
        publish: jest.fn(() => 'id'),
      })),
    }));
    const brokerPubSub = createBroker({type: 'pubsub'});
    const messageId = await brokerPubSub.producer.publish('', {data: {}});
    expect(messageId).toEqual('id');
    servicebus.ServiceBusClient.mockImplementationOnce(() => ({
      createSender: jest.fn(() => ({
        sendMessages: jest.fn(() => 'id'),
      })),
    }));
    const brokerServiceBus = createBroker({
      type: 'servicebus',
      serviceBusStrCnn: 'cnn',
    });
    const idQueue = await brokerServiceBus.producer.publish('', {});
    expect(idQueue).toEqual('id');
  });
  it('Test Case Create Broker Kafka, consumer', async () => {
    const pool = createPool();
    expect(pool).toBeDefined();
    const consumerKafkaMock = jest.fn();
    const consumerObj = {
      connect: jest.fn(() => Promise.resolve()),
      subscribe: jest.fn(),
      run: jest.fn(() => Promise.resolve()),
    };
    consumerKafkaMock.mockReturnValueOnce(consumerObj);
    kafkajs.Kafka.mockImplementationOnce(() => ({
      consumer: consumerKafkaMock,
    }));
    const broker = createBroker({type: 'kafka', kafkaOption: {}});
    const spy = jest.spyOn(consumerObj, 'connect');
    await broker.consumer.addListener({
      topic: '',
      onMessage: {},
      onError: {},
    });
    expect(spy).toHaveBeenCalled();
    const objectSusbscription = {
      addListener: jest.fn(() => 'id'),
    };
    pubsub.PubSub.mockImplementationOnce(() => ({
      subscription: jest.fn(() => objectSusbscription),
    }));
    const spyPub = jest.spyOn(objectSusbscription, 'addListener');
    const brokerPubSub = createBroker({type: 'pubsub'});
    await brokerPubSub.consumer.addListener({
      topic: '',
      onMessage: () => undefined,
      onError: {},
    });
    expect(spyPub).toHaveBeenCalled();

    const objectSubscribe = {
      subscribe: jest.fn(() => 'id'),
    };
    servicebus.ServiceBusClient.mockImplementationOnce(() => ({
      createReceiver: jest.fn(() => objectSubscribe),
    }));
    const spySer = jest.spyOn(objectSubscribe, 'subscribe');
    const brokerServiceBus = createBroker({
      type: 'servicebus',
      serviceBusStrCnn: 'cnn',
    });
    await brokerServiceBus.consumer.addListener({
      topic: '',
      onMessage: {},
      onError: {},
    });
    expect(spySer).toHaveBeenCalled();
  });
});
