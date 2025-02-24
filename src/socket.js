import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        'force new connection': true,  // This can be removed if not strictly necessary
        reconnectionAttempt: 'Infinity',  // Keeps trying to reconnect indefinitely
        timeout: 10000,  // You may want to adjust this based on your server response time
        transports: ['websocket', 'polling'],  // Added fallback for better reconnection
    };

    try {
        const socket = io("http://localhost:5000", options);
        
        socket.on('connect', () => {
            console.log('Connected to the socket server');
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection failed:', err);
        });

        return socket;
    } catch (error) {
        console.error("Socket initialization failed", error);
        return null;
    }
};
