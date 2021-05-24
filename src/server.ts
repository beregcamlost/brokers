/* eslint-disable no-undef */
import { ListenerConfiguration } from '@def/listener-configuration';
import { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher';
import { KafkaMessage, Message, RecordMetadata } from 'kafkajs';
import { Broker, createBroker, createPool } from '.';

const pool = createPool();

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

const brokerPubsub: Broker = createBroker({
    type: 'pubsub',
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

function onMessagePubSub(this: any, message: PubsubMessage) {
    console.log(message.data?.toString());
}

const consumerPubSub = async () => {
    const ctx = {
        broker: brokerkafka
    };
    await brokerPubsub.consumer.addListener({
        topic: process.env.SUBSCRIPTION as string,
        onError: onError.bind(ctx),
        onMessage: onMessagePubSub.bind(ctx)
    });
}

const publishPubSub = async () => {
    const result = (await brokerPubsub.producer.publish(process.env.TOPIC_PUBSUB as string, { data: { dummy: { hello: 'word' } } })) as string
    console.log(result)
}

const init = async () => {
    await consumerkafka();
    await publishKafka();
    await consumerPubSub();
    await publishPubSub();
}
init();
console.log('Press any key to exit');
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0))