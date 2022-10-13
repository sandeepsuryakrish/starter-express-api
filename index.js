const express = require('express')
const amqplib = require('amqplib/callback_api');
const queue = 'tasks';
const amqp = require("amqplib");
var amqp_url = process.env.CLOUDAMQP_URL || 'amqps://bxydesvc:xVZgGBKGj9okAD9Q7DhGg7AYj16WxBay@puffin.rmq2.cloudamqp.com/bxydesvc';

amqplib.connect(amqp_url, (err, conn) => {
    if (err) throw err;

    // Listener
    conn.createChannel((err, ch2) => {
        if (err) throw err;

        ch2.assertQueue(queue);

        ch2.consume(queue, (msg) => {
            if (msg !== null) {
                console.log(msg.content.toString());
                ch2.ack(msg);
            } else {
                console.log('Consumer cancelled by server');
            }
        });
    });
})



async function connect() {
    const msgBuffer = Buffer.from(JSON.stringify({ number: 10 }));
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
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

const app = express()
app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
    console.log("This is printed after Yo!")
    // connect();
})
app.listen(process.env.PORT || 3000)