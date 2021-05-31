import { ServiceBusClient } from '@azure/service-bus';
import { Attributes, PubSub } from '@google-cloud/pubsub';
import { CompressionTypes, Kafka, Message, RecordMetadata } from 'kafkajs';

export interface BrokerProducer {
  /**
   * Add Publish Function
   */
  publish: (topic: string, message: MessageBroker, args?: ArgsBroker) => Promise<string> | Promise<Array<RecordMetadata>> | Promise<void>;
  /**
   * only used to kafka brokers
   */
  connect: (client: BrokerClientType) => Promise<void>
  /**
   * only used to kafka brokers
   */
  disconnect: (client: BrokerClientType) => Promise<void>
}
export type MessageBrokerValue = {
  data: string | any;
};
export type TopicBorker = {
  topic: string
}
export type ArgsBroker = {
  acks?: number;
  compression?: CompressionTypes;
  attrs?: Attributes;
};
export type MessageBroker = MessageBrokerValue | Message;
export type BrokerClientType = Kafka | ServiceBusClient | PubSub | null;