import { KafkaConfig } from 'kafkajs';

interface KafkaOption extends KafkaConfig {
  groupId: string
}

export interface BrokerConfig {
   [alias: string]: BrokerPublisher
 }

export interface BrokerPublisher {
  /**
   * Option type
   */
  type: 'kafka'|'pubsub'|'servicebus',
  /**
   *  Kafka Option
   */
  kafkaOption: KafkaOption,
  /**
   * Service Bus
   */
  serviceBusStrCnn: string,
}
