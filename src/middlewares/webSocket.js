import io from 'socket.io-client';
import commonHelper from "../helpers/common.helper";

const socketEndpoint = 'http://localhost:8080';
let _instance = null;
class WebSocketClient {
    static getInstance() {
        if (_instance === null) {
            _instance = new WebSocketClient();
        }

        return _instance;
    }

    connect() {
        const userId = commonHelper.getLoggedUserId();
        if (!userId) return;

        const options = {
            query: `userId=${ userId }`,
            path: '/socket',
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 99999
        };

        const socket = io(socketEndpoint, options);
        socket.on('connect', () => {
            console.log('Client Connected');

            socket.on('disconnect', () => {
                console.log('Got disconnect!');
            });
        });

        return this.socket = socket
    }
}

export default WebSocketClient;