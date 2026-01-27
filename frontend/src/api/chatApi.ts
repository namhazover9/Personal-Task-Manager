import axiosInstance from './axiosInstance';
import { ChatMessage, Conversation, UserSearchResult } from '../types/chat';

export const getUserConversations = async (): Promise<Conversation[]> => {
    const response = await axiosInstance.get('/chat/conversations');
    return response.data;
};

export const createPrivateChat = async (userId: number): Promise<Conversation> => {
    const response = await axiosInstance.post(`/chat/conversations/private?userId=${userId}`);
    return response.data;
};

export const getMessages = async (conversationId: number): Promise<ChatMessage[]> => {
    const response = await axiosInstance.get(`/chat/conversations/${conversationId}/messages`);
    return response.data;
};

export const searchUsers = async (query: string): Promise<UserSearchResult[]> => {
    const response = await axiosInstance.get(`/users/search?q=${query}`);
    return response.data;
};
