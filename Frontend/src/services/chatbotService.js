import api from './api';

const CHAT_API = '/chat';

export const sendChatMessage = async (message, conversationId = null) => {
    try {
        const response = await api.post(`${CHAT_API}/message`, {
            message,
            conversationId
        });
        return response.data;
    } catch (error) {
        console.error('Send Chat Message API error', error);
        throw error;
    }
};

export const getChatHistory = async (conversationId) => {
    try {
        const response = await api.get(`${CHAT_API}/history/${conversationId}`);
        return response.data;
    } catch (error) {
        console.warn('Get Chat History API failed', error);
        return { messages: [] };
    }
};

export const getRelevantArticles = async (query) => {
    try {
        const response = await api.get(`${CHAT_API}/suggestions`, {
            params: { q: query }
        });
        return response.data;
    } catch (error) {
        console.warn('Get Relevant Articles API failed', error);
        return { items: [] };
    }
};

export const rateChatResponse = async (messageId, rating) => {
    try {
        const response = await api.post(`${CHAT_API}/rate`, {
            messageId,
            rating
        });
        return response.data;
    } catch (error) {
        console.warn('Rate Chat Response API failed', error);
        return { success: true };
    }
};
