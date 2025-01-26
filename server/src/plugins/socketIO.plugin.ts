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

            socket.on('message', (data: any) => {
                console.log('Message received:', data);
                app.io.emit('message', data);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    });
}
