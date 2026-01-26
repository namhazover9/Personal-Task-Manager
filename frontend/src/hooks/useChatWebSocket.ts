import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { ChatMessage } from '../types/chat';
import { getChatHistory } from '../api/chatApi';
import { useAuth } from '../contexts/AuthContext'; // Assume we have this or similar to get current user

export const useChatWebSocket = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [connected, setConnected] = useState(false);
    const clientRef = useRef<Client | null>(null);
    // Get current user from localStorage since AuthContext might not expose username directly or to be simple
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.username || 'Anonymous';

    useEffect(() => {
        // 1. Fetch History
        const fetchHistory = async () => {
            try {
                const history = await getChatHistory();
                setMessages(history);
            } catch (error) {
                console.error("Failed to load chat history", error);
            }
        };
        fetchHistory();

        // 2. Setup WebSocket
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws', // Backend WebSocket endpoint
            reconnectDelay: 5000,
            onConnect: () => {
                setConnected(true);
                console.log('Connected to WebSocket');

                // Subscribe to public topic
                client.subscribe('/topic/public', (message) => {
                    const receivedMsg: ChatMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, receivedMsg]);
                });
            },
            onDisconnect: () => {
                setConnected(false);
                console.log('Disconnected from WebSocket');
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, []);

    const sendMessage = (content: string) => {
        if (clientRef.current && connected && content.trim()) {
            const chatMessage: ChatMessage = {
                sender: username,
                content: content.trim(),
            };

            clientRef.current.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(chatMessage),
            });
        }
    };

    return { messages, connected, sendMessage, currentUser: username };
};
