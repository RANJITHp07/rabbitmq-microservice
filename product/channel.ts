import amqp, { Channel, Connection } from "amqplib";

let channel: Channel;
let connection: Connection;

function connect(callback: (error:unknown) => void) {
  const amqpServer = 'amqp://rabbitmq-service';

  amqp.connect(amqpServer, async function (error:any, conn:any) {
    if (error) {
      callback(error);
      return;
    }

    connection = conn;

    try {
      channel = await connection.createChannel();
      channel.assertQueue("ORDER")
      console.log("product")
      callback(null);
    } catch (error) {
      callback(error);
    }
  });
}

export { channel, connection, connect };
