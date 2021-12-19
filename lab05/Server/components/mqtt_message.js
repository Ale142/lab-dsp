class MQTTMessage {
    constructor(status, userId, userName) {

        this.status = status;
        if (status === 'active') {
            this.userId = userId;
            this.userName = userName
        }
    }
}

module.exports = MQTTMessage;