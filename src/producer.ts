import { ServiceBusClient } from '@azure/service-bus';
import { PubSub } from '@google-cloud/pubsub';
import { ArgsBroker, BrokerClientType, BrokerProducer, MessageBroker, MessageBrokerValue, TopicBorker } from '@def/broker-producer';
import { Kafka, Message, ProducerRecord } from 'kafkajs';
import xss from 'xss';
import { BrokerConfiguration } from '@def/broker-config';

/**
 * create producer from event
 * @param {*} brokerClient
 * @param {*} brokerOptions
 * @returns {Producer}
 */
const createProducer = (brokerClient: BrokerClientType, brokerOptions: BrokerConfiguration): BrokerProducer => {
  const defaultRecord = {
    topic: '',
    data: undefined,
    attrs: undefined,
  };

  /**
   *
   * @param {Kafka} client
   * @param {import('kafkajs').ProducerRecord} record
   */
  const publishMessageKafka = async (client: BrokerClientType, record: ProducerRecord) => {
    /**
     * @type {import('kafkajs').Producer}
     */
    const producerKafka = (client as Kafka).producer();
    await producerKafka.connect();
    const res = producerKafka.send(record);
    await producerKafka.disconnect();
    return res;
  };

  /**
   *
   * @param {PubSub} client
   */
  const publishMessagePubSub = (
    client: BrokerClientType,
    record: ArgsBroker & MessageBrokerValue & TopicBorker = defaultRecord,
  ) => {
    /**
     * @type {import("@google-cloud/pubsub").Topic}
     */
    const topicInstance = (client as PubSub).topic(record.topic);
    let dataStr: string | undefined = record.data;

    if (typeof dataStr !== 'string') {
      dataStr = JSON.stringify(dataStr);
    }

    return topicInstance.publish(Buffer.from(dataStr, 'utf-8'), record.attrs);
  };

  /**
   *
   * @param {import('@azure/service-bus').ServiceBusClient} client
   */

  const publishMessageServiceBus = (
    client: BrokerClientType,
    record: ArgsBroker & MessageBrokerValue & TopicBorker = defaultRecord,
  ) => {
    /**
     * @type {import("@azure/service-bus").ServiceBusSender}
     */
    const queueInstance = (client as ServiceBusClient).createSender(record.topic);
    return queueInstance.sendMessages({
      body: JSON.parse(xss(JSON.stringify(record.data || ''))),
    });
  };
  
  const publishMessage = (
    topic: string,
    message: MessageBroker,
    args: ArgsBroker = defaultRecord,
  ) => {
    switch (brokerOptions.type) {
      case 'kafka':
        return publishMessageKafka(brokerClient, {
          topic,
          messages: [message as Message],
          acks: args.acks,
          compression: args.compression,
        });
      case 'pubsub':
        return publishMessagePubSub(brokerClient, {
          ...args,
          ...message as MessageBrokerValue,
          topic,
        });
      case 'servicebus':
        return publishMessageServiceBus(brokerClient, {
          ...args,
          ...message as MessageBrokerValue,
          topic,
        });
      default:
        if (brokerClient) {
          throw new Error('Broker client not found');
        }
        throw new Error('type invalid');
    }
  };
  return {
    publish: publishMessage,
  };
};

/**
 * @callback Publish
 * @param {String} topic
 * @param {*} message
 * @param {*} [args]
 * @returns {Promise<(String|import('kafkajs').RecordMetadata[]|void)>}
 */

/**
 * @typedef {Object} Producer
 * @property {Publish} publish
 */
export { createProducer };
