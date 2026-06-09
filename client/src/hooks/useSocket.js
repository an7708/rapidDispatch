    import { useEffect, useRef, useState, useCallback } from 'react';
    import { io } from 'socket.io-client';

    const SOCKET_URL =
    process.env.REACT_APP_SOCKET_URL ||
    'https://rapiddispatch.onrender.com';

    export function useSocket(agentData) {
    const socketRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const [socketId, setSocketId] = useState(null);
    const [ticketLocks, setTicketLocks] = useState({});
    const [tickets, setTickets] = useState([]);
    const agentRef = useRef(agentData);

    useEffect(() => {
        agentRef.current = agentData;
    }, [agentData]);

    useEffect(() => {
        if (!agentData) return;

        if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        }

        const socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 500,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
    console.log('SOCKET CONNECTED:', socket.id);

    setConnected(true);
    setSocketId(socket.id);

    socket.emit('join_dashboard', {
        name: agentRef.current.name,
        id: agentRef.current.id,
    });
});

        socket.on('connect_error', (err) => {
        console.log('SOCKET ERROR:', err.message);
        });

        socket.on('reconnect', () => {
        setSocketId(socket.id);
        socket.emit('join_dashboard', {
            name: agentRef.current.name,
            id: agentRef.current.id,
        });
        });

        socket.on('disconnect', () => {
        setConnected(false);
        setSocketId(null);
        });

        socket.on('current_locks', (locks) => {
        setTicketLocks(locks);
        });

        socket.on('ticket_locked', ({ ticketId, agentName, agentId, socketId: lockerSocketId }) => {
        setTicketLocks((prev) => ({
            ...prev,
            [ticketId]: { agentName, agentId, socketId: lockerSocketId },
        }));
        });

        socket.on('ticket_unlocked', ({ ticketId }) => {
        setTicketLocks((prev) => {
            const updated = { ...prev };
            delete updated[ticketId];
            return updated;
        });
        });

        socket.on('new_ticket', (ticket) => {
        setTickets((prev) => [ticket, ...prev]);
        });

        socket.on('ticket_updated', (updatedTicket) => {
        setTickets((prev) =>
            prev.map((t) => (t._id === updatedTicket._id ? updatedTicket : t))
        );
        });

        return () => {
        socket.disconnect();
        socketRef.current = null;
        };
    }, []); 
    
    const lockTicket = useCallback((ticketId) => {
    console.log('LOCKING TICKET:', ticketId);

    socketRef.current?.emit('lock_ticket', {
        ticketId,
        agentName: agentRef.current.name,
        agentId: agentRef.current.id,
    });
}, []);

    const unlockTicket = useCallback((ticketId) => {
    console.log('UNLOCKING TICKET:', ticketId);

    socketRef.current?.emit('unlock_ticket', {
        ticketId,
    });
}, []);
    return {
        connected,
        ticketLocks,
        tickets,
        setTickets,
        lockTicket,
        unlockTicket,
        socketId,
    };
    }