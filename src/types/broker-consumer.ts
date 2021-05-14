import { ListenerConfiguration } from '.';

export interface BrokerConsumer {
  /**
   * Add Listener Function
   */
  addListener: (options: ListenerConfiguration) => Promise<void>;
}
