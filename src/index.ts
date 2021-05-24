import { Kafka } from 'kafkajs';
import { PubSub } from '@google-cloud/pubsub';
import { ServiceBusClient } from '@azure/service-bus';
import { createProducer } from './producer';
import { createConsumer } from './consumer';
import { BrokerConfiguration } from './types/broker-config';
import { BrokerProducer } from './types/broker-producer';
import { BrokerConsumer } from './types/broker-consumer';

export type BrokerTypeError = Error | string | boolean;

export interface BrokerError {
  setError: (error: BrokerTypeError) => void;
  haveError: () => boolean;
}

export interface Broker extends BrokerError {
  check: () => Promise<boolean>;
  producer: BrokerProducer;
  consumer: BrokerConsumer;
}

export interface PoolBroker extends BrokerError {
  addBroker: (alias: string, broker: Broker) => void;
  getBroker: (alias: string) => Broker;
  map: (func: (arg0: Broker) => Broker) => Broker[]
}

type BrokerClientType = Kafka | ServiceBusClient | PubSub | null

/**
 * @typedef {Object} KafkaOption
 * @property {import('kafkajs').KafkaConfig} config
 * @property {string} groupId
 */

/**
 * @typedef {Object} BrokerPublisherOption
 * @property {('kafka'|'pubsub'|'servicebus')} type
 * @property {KafkaOption} [kafkaOption]
 * @property {String} [serviceBusStrCnn]
 */

/**
 * @param {BrokerPublisherOption} brokerOptions
 */
const createBroker: (brokerOptions: BrokerConfiguration) => Broker = (brokerOptions) => {
  /**
   * @type {(ServiceBusClient|Kafka|PubSub)}
   */
  let brokerClient: BrokerClientType = null;

  /**
   * create client kafak
   * @param {KafkaOption} options
   */
  const createKafka = (option: BrokerConfiguration) => {
    if (!option.kafkaOption) {
      throw new Error('Kafka config not found')
    }
    return new Kafka(option.kafkaOption);
  };

  const createPubSub = (option: BrokerConfiguration) => {
    return new PubSub(option.clientConfig);
  }

  const createServiceBus = (option: BrokerConfiguration) => {
    if (!option.serviceBusStrCnn) {
      throw new Error('Servicebus string connection not found')
    }
    return new ServiceBusClient(option.serviceBusStrCnn);
  }
  /**
   * @type {boolean|String}
   */
  let err: BrokerTypeError = false;

  /**
   * create publisher instance to create message
   * @param {BrokerPublisherOption} options
   * @returns {(import('kafkajs').Producer)}
   */
  const initBroker = () => {
    switch (brokerOptions.type) {
      case 'kafka':
        brokerClient = createKafka(brokerOptions);
        break;
      case 'servicebus':
        brokerClient = createServiceBus(brokerOptions);
        break;
      case 'pubsub':
        brokerClient = createPubSub(brokerOptions);
        break;
      default:
        brokerClient = null;
        err = 'Broker Type not Defined';
        break;
    }
  };

  initBroker();
  const brokerProducer = createProducer(brokerClient, brokerOptions);
  const brokerConsumer = createConsumer(brokerClient, brokerOptions);
  let producerKafka;

  const check = async () => {
    if (!brokerClient) {
      throw new Error('Broker client not found');
    }

    switch (brokerOptions.type) {
      case 'kafka':
        producerKafka = (brokerClient as Kafka).producer();
        await producerKafka.connect();
        await producerKafka.disconnect();
        return true;
      case 'pubsub':
        await (brokerClient as PubSub).auth.getAccessToken();
        return true;
      case 'servicebus':
        return true;
      default:
        throw new Error('type invalid');
    }
  };
  const setError = (error: BrokerTypeError) => {
    err = error;
  };
  const haveError = () => !!err;
  return {
    check,
    producer: brokerProducer,
    consumer: brokerConsumer,
    setError,
    haveError,
  } as Broker;
};

/**
 * @typedef {Object} Broker
 * @property {*} check
 * @property {import('./producer').Producer} producer
 * @property {import('./consumer').Consumer} consumer
 * @property {*} setError
 * @property {*} haveError
 */

/**
 * @callback GetBroker
 * @param {String} alias
 * @returns {Broker}
 */

/**
 * @typedef {Object} PoolBroker
 * @property {} addBroker
 * @property {GetBroker} getBroker
 * @property {*} map
 */

/**
 * @returns {PoolBroker}
 */
const createPool = (): PoolBroker => {
  const pool: Record<string, Broker> = {};
  const aliases: Array<string> = [];
  const addBroker = (alias: string, broker: Broker) => {
    pool[alias] = broker;
    aliases.push(alias);
  };/**
   * get broker instance by alias
   * @param {String} alias
   * @returns {Broker}
   */
  const getBroker = (alias: string) => {
    const broker = pool[alias];
    if (!broker) {
      throw new Error('broker not found');
    }
    return broker;
  };
  const map = (func: (arg0: Broker) => Broker) => aliases.map((alias) => func(pool[alias]));

  let err: string | boolean | Error = false;
  const setError = (error: boolean | Error | string) => {
    err = error;
  };
  const haveError = () => !!err;
  return {
    addBroker,
    getBroker,
    map,
    setError,
    haveError,
  };
};

export { createBroker, createPool };
