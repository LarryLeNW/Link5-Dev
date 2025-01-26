'use client'
import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';

const ChatPage = () => {
    const { socket, connected } = useSocket();
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        socket.on('message', (message: string) => {
            setMessages((prev) => [message, ...prev]);
        });

        return () => {
            socket.off('message');
        };
    }, [socket]);

    const sendMessage = () => {
        if (input.trim()) {
            socket.emit('message', input);
            setMessages((prev) => [...prev, `You: ${input}`]);
            setInput('');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
            <h1>Chat</h1>
            <p>{connected ? 'Connected' : 'Disconnected'}</p>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>

        </div>
    );
};

export default ChatPage;
