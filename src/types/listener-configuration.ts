export interface ListenerConfiguration<T = unknown, K = unknown> {
  /**
   * Listener Topic
   */
  topic: string,
  /**
   * onMessage function
   */
   onMessage:  (this: T, message: K) => void,
  /**
   * onError function
   */
  onError: (this: T, error: Error) => void,
}

//message and error are unknown because the values can be different depending of the interface 
//ServiceBusReceivedMessage, KafkaMessage, ProcessErrorArgs, Error