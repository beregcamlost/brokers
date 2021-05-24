import { ClientConfig } from '@google-cloud/pubsub';
import { KafkaConfig } from 'kafkajs';

interface KafkaOption extends KafkaConfig {
  groupId: string
}

export interface BrokerConfigurations {
   [alias: string]: BrokerConfiguration
 }

export interface BrokerConfiguration {
  /**
   * Option type
   */
  type: 'kafka'|'pubsub'|'servicebus',
  /**
   *  Kafka Option
   */
  kafkaOption?: KafkaOption,
  /**
   * Service Bus
   */
  serviceBusStrCnn?: string,
  /**
   * Pubsub
   */
  clientConfig?: ClientConfig;
}
