    import { io } from 'socket.io-client';

    const SOCKET_URL =
        process.env.REACT_APP_SOCKET_URL ||
        'https://rapiddispatch.onrender.com';

    const socket = io(SOCKET_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
    });

    export default socket;