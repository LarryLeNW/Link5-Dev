import { useEffect, useRef, useState } from 'react';
import { getSocket } from '@/lib/socket';

export const useSocket = () => {
    const socketRef = useRef(getSocket());
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('Connected to Socket.IO server');
            setConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
            setConnected(false);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return { socket: socketRef.current, connected };
};
