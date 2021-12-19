var mqtt = require('mqtt')
var MQTTMessage = require('../components/mqtt_message.js');
var options = {
    keepalive: 30,
    clientId: 'todo-manager-service',
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
    },
    rejectUnauthorized: false
}
var host = 'ws://127.0.0.1:8080'
var server = mqtt.connect(host, options);

module.exports = server;