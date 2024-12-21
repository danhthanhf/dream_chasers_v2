import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class WebsocketService {
    constructor() {
        this.stompClient = null;
        this.reconnectDelay = 5000;
        this.subscriptions = {};
    }

    connect(token) {
        return new Promise((resolve, reject) => {
            if (this.stompClient && this.stompClient.connected) {
                resolve();
                return;
            }

            const socket = new SockJS(
                `http://localhost:8080/ws?token=${token}`
            );
            this.stompClient = Stomp.over(socket);

            const connectCallback = () => {
                Object.keys(this.subscriptions).forEach((destination) => {
                    this.stompClient.subscribe(
                        destination,
                        this.subscriptions[destination]
                    );
                });
                resolve();
            };

            const errorCallback = (error) => {
                setTimeout(() => {
                    this.connect();
                }, this.reconnectDelay);
            };

            this.stompClient.connect({}, connectCallback, errorCallback);

            socket.onclose = () => {
                setTimeout(() => {
                    this.connect().then(resolve).catch(reject);
                }, this.reconnectDelay);
            };
        });
    }

    subscribe(destination, callback) {
        this.subscriptions[destination] = callback;
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.subscribe(destination, callback);
            console.log(`Subscribe from destination: ${destination}`);
        }
    }

    unsubscribe(destination) {
        const subscription = this.subscriptions[destination];
        if (subscription && subscription.unsubscribe) {
            subscription.unsubscribe();
            delete this.subscriptions[destination];
            console.log(`Unsubscribed from destination: ${destination}`);
        } else {
            console.log(
                `No active subscription for destination: ${destination}`
            );
        }
    }

    sendMessage(destination, message) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send(destination, {}, JSON.stringify(message));
        }
    }

    disconnect() {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.disconnect();
        }
    }
}

const websocketService = new WebsocketService();
export default websocketService;
