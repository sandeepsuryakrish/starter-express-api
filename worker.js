const amqplib = require('amqplib/callback_api');
const amqp = require("amqplib");
const queue = 'tasks';

// amqplib.connect('amqp://localhost', (err, conn) => {
//     if (err) throw err;

//     // Sender
//     conn.createChannel((err, ch1) => {
//         if (err) throw err;

//         ch1.assertQueue(queue);
//         ch1.sendToQueue(queue, Buffer.from('something new to do'));
//         // setInterval(() => {
//         //     conn.close
//         // }, 2000)

//         // setInterval(() => {
//         //     ch1.sendToQueue(queue, Buffer.from('something to do'));
//         // }, 1000);
//     });
//     // setInterval(
//     //     function () {
//     //         // ch1.close();
//     //         conn.close();
//     //     },
//     //     2000
//     // );
//     // disconnect();

// });

// function disconnect() {
//     return this.channel.close().then(() => { return connector.close(); });
// };
var amqp_url = process.env.CLOUDAMQP_URL || 'amqps://bxydesvc:xVZgGBKGj9okAD9Q7DhGg7AYj16WxBay@puffin.rmq2.cloudamqp.com/bxydesvc';

async function connect() {
    const msgBuffer = Buffer.from(JSON.stringify({ number: 10 }));
    try {
        const connection = await amqp.connect(amqp_url);
        const channel = await connection.createChannel();
        await channel.assertQueue("tasks");
        await channel.sendToQueue("tasks", msgBuffer);
        console.log("Sending message to number queue");
        await channel.close();
        await connection.close();
    } catch (ex) {
        console.error(ex);
    }
}
connect();