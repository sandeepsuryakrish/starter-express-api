const amqplib = require('amqplib');

var amqp_url = process.env.CLOUDAMQP_URL || 'amqps://bxydesvc:xVZgGBKGj9okAD9Q7DhGg7AYj16WxBay@puffin.rmq2.cloudamqp.com/bxydesvc';

async function produce(message) {
    console.log("Publishing");
    var conn = await amqplib.connect(amqp_url, "heartbeat=60");
    var ch = await conn.createChannel()
    var exch = 'test_exchange';
    var q = 'test_queue';
    var rkey = 'test_route';
    var msg = message;
    await ch.assertExchange(exch, 'direct', { durable: true }).catch(console.error);
    await ch.assertQueue(q, { durable: true });
    await ch.bindQueue(q, exch, rkey);
    await ch.publish(exch, rkey, Buffer.from(msg));
    setTimeout(function () {
        ch.close();
        conn.close();
    }, 100);
}
produce("https://www.google.com");