import envConfig from '@/config';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = envConfig.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:4000';

let socket: Socket;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            transports: ['websocket'],
            withCredentials: true,
        });
    }
    return socket;
};
