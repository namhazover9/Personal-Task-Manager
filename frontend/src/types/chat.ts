export interface ChatMessage {
    id: number;
    content: string;
    senderId: number;
    senderName: string;
    conversationId: number;
    timestamp: string;
}

export interface Conversation {
    id: number;
    name: string;
    type: 'PRIVATE' | 'GROUP';
    lastMessage: string;
    lastMessageAt: string;
    otherUserId: number; // For identifying who we are chatting with in private chat
}

export interface UserSearchResult {
    id: number;
    username: string;
    alias?: string;
    email: string;
}
