import React, { useState, useEffect, useRef } from 'react';
import {
    Box, TextField, IconButton, Typography, Paper, Container,
    Grid, List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText, Divider,
    Autocomplete, CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import { useChatWebSocket } from '../hooks/useChatWebSocket';
import { useTheme } from '@mui/material/styles';
import { searchUsers, createPrivateChat } from '../api/chatApi';
import { UserSearchResult } from '../types/chat';

const Chat = () => {
    const theme = useTheme();
    const {
        conversations,
        activeConversationId,
        messages,
        connected,
        sendMessage,
        selectConversation,
        currentUser,
        addConversation
    } = useChatWebSocket();

    const [inputValue, setInputValue] = useState('');
    const [searchOptions, setSearchOptions] = useState<UserSearchResult[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (inputValue.trim() && activeConversationId) {
            sendMessage(activeConversationId, inputValue);
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const handleUserSearch = async (query: string) => {
        if (query.length < 2) {
            setSearchOptions([]);
            return;
        }
        setSearchLoading(true);
        try {
            const results = await searchUsers(query);
            // Filter out current user? Backend might handle or filtered here
            setSearchOptions(results);
        } catch (err) {
            console.error(err);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSelectUser = async (user: UserSearchResult | null) => {
        if (!user) return;
        try {
            const conversation = await createPrivateChat(user.id);
            addConversation(conversation); // Add to list if new
            selectConversation(conversation.id); // Select it
            // Clear search
            setSearchOptions([]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container maxWidth={false} sx={{ mt: 2, mb: 2, height: 'calc(100vh - 100px)', width: '100%', p: 0 }}>
            <Paper
                elevation={3}
                sx={{
                    height: '100%',
                    display: 'flex',
                    overflow: 'hidden',
                    borderRadius: 2
                }}
            >
                {/* Left Sidebar */}
                <Box sx={{
                    width: { xs: '100%', md: 320, lg: 360 },
                    borderRight: 1,
                    borderColor: 'divider',
                    display: { xs: activeConversationId ? 'none' : 'flex', md: 'flex' },
                    flexDirection: 'column',
                    flexShrink: 0,
                    bgcolor: 'background.paper'
                }}>
                    {/* Search Bar - HEADER EQUIVALENT */}
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', height: '72px', display: 'flex', alignItems: 'center' }}>
                        <Autocomplete
                            fullWidth
                            options={searchOptions}
                            getOptionLabel={(option) => option.username || option.email}
                            loading={searchLoading}
                            onInputChange={(event, value) => handleUserSearch(value)}
                            onChange={(event, value) => handleSelectUser(value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Search user..."
                                    size="small"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                                        endAdornment: (
                                            <React.Fragment>
                                                {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    <ListItemText
                                        primary={option.alias || option.username}
                                        secondary={option.email}
                                    />
                                </li>
                            )}
                        />
                    </Box>

                    {/* Conversation List */}
                    <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                        {conversations.map((conv) => (
                            <ListItem key={conv.id} disablePadding>
                                <ListItemButton
                                    selected={activeConversationId === conv.id}
                                    onClick={() => selectConversation(conv.id)}
                                    sx={{
                                        borderRadius: 1,
                                        mx: 1,
                                        mb: 0.5,
                                        '&.Mui-selected': { bgcolor: 'primary.lighter', color: 'primary.dark' }
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar>{conv.name.charAt(0).toUpperCase()}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={conv.name}
                                        secondary={conv.lastMessage || "No messages"}
                                        secondaryTypographyProps={{
                                            noWrap: true,
                                            style: { width: '180px' }
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                    {/* Connection Status Footer */}
                    <Box sx={{ p: 1, bgcolor: 'background.default', textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" color={connected ? 'success.main' : 'error.main'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: connected ? 'success.main' : 'error.main' }} />
                            {connected ? 'Connected' : 'Disconnected'}
                        </Typography>
                    </Box>
                </Box>

                {/* Right Pane: Chat Window */}
                <Box sx={{
                    flexGrow: 1,
                    display: { xs: activeConversationId ? 'flex' : 'none', md: 'flex' },
                    flexDirection: 'column',
                    height: '100%',
                    minWidth: 0
                }}>
                    {activeConversationId ? (
                        <>
                            {/* Header - Ensure same height as Left Sidebar Header */}
                            <Box sx={{
                                p: 2,
                                borderBottom: 1,
                                borderColor: 'divider',
                                bgcolor: 'background.paper',
                                display: 'flex',
                                alignItems: 'center',
                                height: '72px', // MATCH HEIGHT
                                justifyContent: 'space-between'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <IconButton
                                        onClick={() => selectConversation(0)} // Back logic
                                        sx={{ display: { md: 'none' } }}
                                    >
                                        <Typography variant="h6">←</Typography>
                                    </IconButton>

                                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                        {conversations.find(c => c.id === activeConversationId)?.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {conversations.find(c => c.id === activeConversationId)?.name || 'Chat'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Online
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton>
                                    {/* Settings or More options placeholder */}
                                </IconButton>
                            </Box>

                            {/* Messages */}
                            <Box sx={{
                                flexGrow: 1,
                                p: 2,
                                overflowY: 'auto',
                                bgcolor: '#F4F6F8', // Lighter grey background
                                backgroundImage: `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9))`, // Optional pattern overlay
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1.5
                            }}>
                                {messages.map((msg, index) => {
                                    // Robust check for "Me": use currentUser logic
                                    // Ensure currentUser match logic is solid (e.g. trim, case)
                                    const isMe = msg.senderName === currentUser;
                                    return (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: isMe ? 'flex-end' : 'flex-start',
                                                width: '100%', // Ensure Box takes full width to allow flex alignment
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 1, maxWidth: '75%' }}>

                                                {/* Avatar for Other Person */}
                                                {!isMe && (
                                                    <Avatar sx={{ width: 32, height: 32, mb: 0.5, fontSize: 14 }}>
                                                        {msg.senderName.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                )}

                                                {/* Message Bubble */}
                                                <Box
                                                    sx={{
                                                        p: 1.5,
                                                        px: 2,
                                                        borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                                        bgcolor: isMe ? 'primary.main' : 'common.white',
                                                        color: isMe ? 'common.white' : 'text.primary',
                                                        boxShadow: isMe ? 4 : 1, // High shadow for me, low for other (or none)
                                                        position: 'relative',
                                                        wordBreak: 'break-word', // prevent overflow
                                                    }}
                                                >
                                                    {/* Sender Name (Optional, maybe skip for 1-1 chat) */}
                                                    {/* {!isMe && (
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 'bold' }}>
                                                            {msg.senderName}
                                                        </Typography>
                                                    )} */}

                                                    <Typography variant="body2" sx={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                                                        {msg.content}
                                                    </Typography>

                                                    {/* Timestamp */}
                                                    <Typography variant="caption" sx={{
                                                        display: 'block',
                                                        mt: 0.5,
                                                        textAlign: 'right',
                                                        opacity: 0.8,
                                                        fontSize: '0.7rem',
                                                        color: isMe ? 'rgba(255,255,255,0.8)' : 'text.secondary'
                                                    }}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </Box>

                            {/* Input Area */}
                            <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Type a message..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={!connected}
                                    size="medium"
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: 3 }
                                    }}
                                />
                                <IconButton
                                    color="primary"
                                    onClick={handleSend}
                                    disabled={!connected || !inputValue.trim()}
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'primary.dark' },
                                        width: 50,
                                        height: 50,
                                        borderRadius: 2,
                                        boxShadow: 2
                                    }}
                                >
                                    <SendIcon />
                                </IconButton>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="h5" color="text.secondary">
                                Select a conversation or find a user to chat
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Chat;
