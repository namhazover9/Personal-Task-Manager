import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Container } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useChatWebSocket } from '../hooks/useChatWebSocket';
import { useTheme } from '@mui/material/styles';

const Chat = () => {
    const theme = useTheme();
    const { messages, connected, sendMessage, currentUser } = useChatWebSocket();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (inputValue.trim()) {
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <Container maxWidth="xl" sx={{ width: '100%', mt: 4, mb: 4, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" fontWeight="bold">
                    Global Chat
                </Typography>
                <Typography variant="caption" color={connected ? 'success.main' : 'error.main'}>
                    {connected ? '● Online' : '● Offline'}
                </Typography>
            </Box>

            {/* Messages Area */}
            <Paper
                elevation={3}
                sx={{
                    flexGrow: 1,
                    mb: 2,
                    p: 2,
                    overflowY: 'auto',
                    bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#f5f5f5',
                    borderRadius: 2
                }}
            >
                {messages.map((msg, index) => {
                    const isMe = msg.sender === currentUser;
                    return (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                justifyContent: isMe ? 'flex-end' : 'flex-start',
                                mb: 1.5,
                            }}
                        >
                            <Box
                                sx={{
                                    maxWidth: '70%',
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: isMe ? 'primary.main' : 'background.paper',
                                    color: isMe ? 'primary.contrastText' : 'text.primary',
                                    boxShadow: 1,
                                    borderTopRightRadius: isMe ? 0 : 2,
                                    borderTopLeftRadius: isMe ? 2 : 0,
                                }}
                            >
                                {!isMe && (
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 'bold' }}>
                                        {msg.sender}
                                    </Typography>
                                )}
                                <Typography variant="body1">{msg.content}</Typography>
                            </Box>
                        </Box>
                    );
                })}
                <div ref={messagesEndRef} />
            </Paper>

            {/* Input Area */}
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!connected}
                    sx={{ bgcolor: 'background.paper' }}
                />
                <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={!connected || !inputValue.trim()}
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                        borderRadius: 2,
                        width: 56,
                        height: 56
                    }}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Container>
    );
};

export default Chat;
