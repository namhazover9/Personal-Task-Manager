import axiosInstance from './axiosInstance';
import { ChatMessage } from '../types/chat';

export const getChatHistory = async (): Promise<ChatMessage[]> => {
    const response = await axiosInstance.get('/chat/history');
    return response.data;
};
