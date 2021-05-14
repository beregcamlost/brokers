export interface ListenerConfiguration {
  /**
   * Listener Topic
   */
  topic: string,
  /**
   * onMessage function
   */
   onMessage: (message: any) => void,
  /**
   * onError function
   */
  onError: (error: any) => void,
}

//message and error are unknown because the values can be different depending of the interface 
//ServiceBusReceivedMessage, KafkaMessage, ProcessErrorArgs, Error