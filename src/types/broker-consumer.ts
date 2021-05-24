import { ListenerConfiguration } from '.';

export interface BrokerConsumer {
  /**
   * Add Listener Function
   */
  addListener: <T, K> (options: ListenerConfiguration<T, K>) => Promise<void>;
}
