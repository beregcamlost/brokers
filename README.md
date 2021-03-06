# Broker 

Library to implementations of multiple, connection to brokers: kafka, pubsub and services bus.

## Example

``` js
const brokerkafka: Broker = createBroker({
    type: 'kafka',
    kafkaOption: {
        groupId: 'dummy-group',
        brokers: [process.env.SERVER as string],
        sasl: {
            mechanism: 'plain',
            password: process.env.SECRET as string,
            username: process.env.KEY as string
        },
        ssl: true
    }
});
function onError(this: any, error: Error) {
    console.error(error);
}

function onMessageKafka(this: any, message: KafkaMessage) {
    console.log(message.value?.toString());
}

const consumerkafka = async () => {
    const ctx = {
        broker: brokerkafka
    };
    await brokerkafka.consumer.addListener({
        topic: process.env.TOPIC as string,
        onError: onError.bind(ctx),
        onMessage: onMessageKafka.bind(ctx),
    } as ListenerConfiguration<any, KafkaMessage>);
}

/**
 * Method to publish message
 */
const publishKafka = async () => {
    const msg = {
        value: JSON.stringify({
            dummy: {
                message: 'hello'
            }
        })
    } as Message;
    const result = (await brokerkafka.producer.publish(process.env.TOPIC as unknown as string, msg)) as RecordMetadata[];
    console.log(result);
}

const init = async () => {
    await consumerkafka();
    await publishKafka();
}
init();
```