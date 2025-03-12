import { FastifyInstance } from 'fastify';
import fastifyIO from 'fastify-socket.io';

export default async function socketIOPlugin(app: FastifyInstance): Promise<void> {
    app.register(fastifyIO);

    app.ready((err) => {
        if (err) {
            app.log.error(err);
            throw err;
        }

        app.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            // Xử lý sự kiện chat
            socket.on('join_room', (roomId: string) => {
                socket.join(roomId);
                console.log(`Client ${socket.id} joined room ${roomId}`);
            });

            socket.on('leave_room', (roomId: string) => {
                socket.leave(roomId);
                console.log(`Client ${socket.id} left room ${roomId}`);
            });

            socket.on('chat_message', (data: { roomId: string, message: string, sender: string }) => {
                console.log('Chat message:', data);
                // Gửi tin nhắn đến tất cả client trong room
                app.io.to(data.roomId).emit('chat_message', data);
            });

            // Xử lý sự kiện thông báo
            socket.on('notification', (data: { type: string, message: string, userId?: string }) => {
                console.log('Notification:', data);
                if (data.userId) {
                    // Gửi thông báo đến user cụ thể
                    app.io.to(data.userId).emit('notification', data);
                } else {
                    // Gửi thông báo đến tất cả users
                    app.io.emit('notification', data);
                }
            });

            // Xử lý sự kiện typing
            socket.on('typing', (data: { roomId: string, userId: string, isTyping: boolean }) => {
                socket.to(data.roomId).emit('typing', data);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    });
}


