import { useEffect, useState, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import { ChatMessage, Conversation } from '../types/chat';
import { getUserConversations, getMessages } from '../api/chatApi';

export const useChatWebSocket = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [connected, setConnected] = useState(false);

    // Use Ref to track active conversation ID inside WebSocket callback without dependency issues
    const activeConversationIdRef = useRef<number | null>(null);
    const clientRef = useRef<Client | null>(null);

    // Get current user info
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.username || 'Anonymous';

    // Update Ref when State changes
    useEffect(() => {
        activeConversationIdRef.current = activeConversationId;
    }, [activeConversationId]);

    // 1. Fetch Conversations on Mount
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await getUserConversations();
                setConversations(data);
            } catch (error) {
                console.error("Failed to load conversations", error);
            }
        };
        fetchConversations();
    }, []);

    // 2. Load Messages when Active Conversation Changes
    useEffect(() => {
        if (activeConversationId) {
            const loadMessages = async () => {
                try {
                    const data = await getMessages(activeConversationId);
                    setMessages(data);
                } catch (error) {
                    console.error("Failed to load messages", error);
                }
            };
            loadMessages();
        } else {
            setMessages([]);
        }
    }, [activeConversationId]);

    // Handle incoming message logic (Wrapped in useCallback or just Ref logic)
    // We can't easily useCallback with empty deps if we depend on setMessages/setConversations, 
    // but functional updates solve that.
    const handleIncomingMessage = (msg: ChatMessage) => {
        const currentActiveId = activeConversationIdRef.current;

        // 1. Update Messages if open
        if (currentActiveId === msg.conversationId) {
            setMessages(prev => {
                // Prevent duplicate by ID check
                if (prev.some(m => m.id === msg.id)) {
                    return prev;
                }
                return [...prev, msg];
            });
        }

        // 2. Update Conversation List (Move to top, update last msg)
        setConversations(prev => {
            const index = prev.findIndex(c => c.id === msg.conversationId);
            if (index > -1) {
                const updatedConv = {
                    ...prev[index],
                    lastMessage: msg.content,
                    lastMessageAt: msg.timestamp
                };
                const newList = [...prev];
                newList.splice(index, 1);
                return [updatedConv, ...newList];
            } else {
                // If conversation doesn't exist in list (new private chat initiated by other), 
                // we should probably fetch it or reload list. 
                // Simple hack: Re-fetch all conversations to be safe and get correct names
                // But for now, let's just return prev to avoid crash, or try to patch if we had Conversation object.
                // Ideal: Call getUserConversations() debounced.
                getUserConversations().then(data => setConversations(data));
                return prev;
            }
        });
    };

    // 3. Setup WebSocket
    useEffect(() => {
        const token = localStorage.getItem('token');
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000,
            onConnect: () => {
                setConnected(true);
                console.log('Connected to WebSocket');

                // Subscribe to Private Messages (User Queue)
                client.subscribe('/user/queue/messages', (message) => {
                    const receivedMsg: ChatMessage = JSON.parse(message.body);
                    handleIncomingMessage(receivedMsg);
                });
            },
            onDisconnect: () => {
                setConnected(false);
                console.log('Disconnected');
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

    const sendMessage = (conversationId: number, content: string) => {
        if (clientRef.current && connected && content.trim()) {
            const payload = {
                conversationId: conversationId,
                content: content.trim(),
            };

            clientRef.current.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(payload),
            });
        }
    };

    const selectConversation = (id: number) => {
        setActiveConversationId(id);
    };

    // Helper to add new conversation locally after creation
    const addConversation = (conv: Conversation) => {
        setConversations(prev => {
            // Avoid duplicates in list
            if (prev.some(c => c.id === conv.id)) return prev;
            return [conv, ...prev];
        });
        setActiveConversationId(conv.id);
    };

    return {
        conversations,
        activeConversationId,
        messages,
        connected,
        sendMessage,
        selectConversation,
        currentUser: username,
        addConversation
    };
};
