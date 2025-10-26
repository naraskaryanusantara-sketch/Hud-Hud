import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { Chat, Message, Contact } from '../types';
import { SendIcon, ArrowLeftIcon, PlusIcon, ImageIcon, FileIcon, TrashIcon, CircleIcon, CheckCircleIcon, EllipsisVerticalIcon, CheckIcon, DoubleCheckIcon, MenuIcon } from './Icons';
import { getAiResponse } from '../services/geminiService';
import { useAuth } from '../App';
import NewChatModal from './NewChatModal';

interface ChatPageProps {
    chats: Chat[];
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
    contacts: Contact[];
    activeChat: Chat | null;
    setActiveChat: (chat: Chat | null) => void;
    onSelectChat: (chat: Chat) => void;
    onStartNewChat: (contact: Contact) => void;
    onShowGroupInfo: () => void;
    onShowContactInfo: (contactName: string) => void;
    onClearChat: (chatId: number) => void;
    onMenuClick: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ chats, setChats, contacts, activeChat, setActiveChat, onSelectChat, onStartNewChat, onShowGroupInfo, onShowContactInfo, onClearChat, onMenuClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

    const filteredChats = useMemo(() =>
        chats.filter(chat =>
            chat.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [chats, searchTerm]
    );

    const handleSendMessage = (newMessage: Message) => {
        if (!activeChat) return;

        const updateChatWithNewMessage = (prev: Chat | null): Chat | null => {
            if (!prev) return null;
            const newMessages = [...prev.messages, newMessage];
            return { ...prev, messages: newMessages };
        }

        setActiveChat(updateChatWithNewMessage(activeChat));

        const updatedChats = chats.map(chat => {
            if (chat.id === activeChat.id) {
                return { ...updateChatWithNewMessage(chat)!, lastMessage: newMessage.type === 'text' ? newMessage.text : `Sent a ${newMessage.type}`, timestamp: 'Now' };
            }
            return chat;
        });

        setChats(updatedChats);

        if (activeChat.isAiAssistant) {
            handleAiResponse(newMessage.text);
        }
    };
    
    const handleAiResponse = async (prompt: string) => {
        const aiResponseText = await getAiResponse(prompt);
        const aiMessage: Message = {
            id: Date.now(),
            text: aiResponseText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'other',
            isAi: true,
            type: 'text',
        };

        const updateChatWithAiMessage = (chat: Chat): Chat => {
             const newMessages = [...chat.messages, aiMessage];
             return { ...chat, messages: newMessages, lastMessage: aiMessage.text, timestamp: 'Now' };
        }
        
        setActiveChat(prev => prev ? updateChatWithAiMessage(prev) : null);
        setChats(prevChats => prevChats.map(c => c.id === activeChat?.id ? updateChatWithAiMessage(c) : c));
    };

    const handleDeleteMessages = (messageIds: Set<number>) => {
        if (!activeChat) return;

        const updateChatAfterDelete = (chat: Chat): Chat => {
            const newMessages = chat.messages.filter(m => !messageIds.has(m.id));
            const newLastMessage = newMessages.length > 0 ? newMessages[newMessages.length - 1].text : "Chat cleared";
            return { ...chat, messages: newMessages, lastMessage: newLastMessage };
        };

        setActiveChat(prev => prev ? updateChatAfterDelete(prev) : null);
        setChats(prev => prev.map(c => c.id === activeChat.id ? updateChatAfterDelete(c) : c));
    };

    return (
        <>
            <div className="flex flex-1 h-full overflow-hidden">
                <div className={`w-full md:w-1/3 lg:w-1/4 bg-cream-100 border-r border-cream-200 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
                    <ChatList 
                        chats={filteredChats} 
                        onSelectChat={onSelectChat} 
                        activeChat={activeChat} 
                        searchTerm={searchTerm} 
                        setSearchTerm={setSearchTerm} 
                        onAddChat={() => setIsNewChatModalOpen(true)}
                        onMenuClick={onMenuClick}
                    />
                </div>
                <div className={`w-full md:w-2/3 lg:w-3/4 flex flex-col bg-cream-50 ${activeChat ? 'flex' : 'hidden md:flex'}`}>
                    {activeChat ? (
                        <ChatView 
                            key={activeChat.id} 
                            chat={activeChat} 
                            onSendMessage={handleSendMessage} 
                            onDeleteMessages={handleDeleteMessages} 
                            onBack={() => setActiveChat(null)} 
                            onShowGroupInfo={onShowGroupInfo}
                            onShowContactInfo={onShowContactInfo}
                            onClearChat={onClearChat}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-center">
                            <div className="text-denim-800">
                                <h2 className="text-2xl font-semibold">Welcome to Hud-Hud</h2>
                                <p className="mt-2 text-denim-700">Select a chat to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isNewChatModalOpen && (
                <NewChatModal 
                    contacts={contacts}
                    onClose={() => setIsNewChatModalOpen(false)}
                    onStartChat={(contact) => {
                        onStartNewChat(contact);
                        setIsNewChatModalOpen(false);
                    }}
                />
            )}
        </>
    );
};

interface ChatListProps {
    chats: Chat[];
    onSelectChat: (chat: Chat) => void;
    activeChat: Chat | null;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onAddChat: () => void;
    onMenuClick: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat, activeChat, searchTerm, setSearchTerm, onAddChat, onMenuClick }) => {
    return (
        <div className="flex flex-col h-full relative">
             <header className="flex md:hidden items-center p-3 bg-denim-900 text-cream-100 shadow-md">
                <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-denim-800">
                    <MenuIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold ml-4">Hud-Hud</h1>
            </header>
            <div className="p-4 border-b border-cream-200">
                <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-full bg-white border border-cream-300 focus:ring-2 focus:ring-denim-500 focus:outline-none"
                />
            </div>
            <div className="flex-1 overflow-y-auto">
                {chats.map(chat => (
                    <div key={chat.id} onClick={() => onSelectChat(chat)} className={`flex items-center p-3 cursor-pointer transition-colors duration-200 ${activeChat?.id === chat.id ? 'bg-denim-100' : 'hover:bg-cream-200'}`}>
                        <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                        <div className="flex-1 ml-4 overflow-hidden">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-denim-900 truncate">{chat.name}</h3>
                                <span className="text-xs text-denim-600 flex-shrink-0 ml-2">{chat.timestamp}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <p className="text-sm text-denim-700 truncate w-4/5">{chat.lastMessage}</p>
                                {chat.unreadCount > 0 && <span className="bg-denim-800 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{chat.unreadCount}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={onAddChat} className="absolute bottom-6 right-6 bg-denim-800 text-white w-14 h-14 rounded-full shadow-lg hover:bg-denim-900 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-denim-500 flex items-center justify-center">
                <PlusIcon className="w-8 h-8" />
            </button>
        </div>
    );
};

const ChatView: React.FC<{ chat: Chat; onSendMessage: (message: Message) => void; onDeleteMessages: (messageIds: Set<number>) => void; onBack: () => void; onShowGroupInfo: () => void; onShowContactInfo: (contactName: string) => void; onClearChat: (chatId: number) => void; }> = ({ chat, onSendMessage, onDeleteMessages, onBack, onShowGroupInfo, onShowContactInfo, onClearChat }) => {
    const [newMessage, setNewMessage] = useState('');
    const [isSelectionMode, setSelectionMode] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState<Set<number>>(new Set());
    const [isMenuOpen, setMenuOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();
    
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat.messages]);
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const message: Message = {
                id: Date.now(),
                text: file.name,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sender: 'me',
                type: file.type.startsWith('image/') ? 'image' : 'file',
                file: { name: file.name, url: event.target?.result as string },
                status: 'sent'
            };
            onSendMessage(message);
        };
        reader.readAsDataURL(file);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage({ id: Date.now(), text: newMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sender: 'me', type: 'text', status: 'sent' });
            setNewMessage('');
        }
    };

    const handleMessageInteraction = (messageId: number) => {
        if (isSelectionMode) {
            const newSelection = new Set(selectedMessages);
            if (newSelection.has(messageId)) {
                newSelection.delete(messageId);
            } else {
                newSelection.add(messageId);
            }
            setSelectedMessages(newSelection);
        }
    };

    const handleLongPress = (messageId: number) => {
        if (isSelectionMode) return;
        setSelectionMode(true);
        setSelectedMessages(new Set([messageId]));
    };

    const confirmDelete = () => {
        if (selectedMessages.size > 0) {
            onDeleteMessages(selectedMessages);
            setSelectionMode(false);
            setSelectedMessages(new Set());
        }
    };

    const handleHeaderClick = () => {
        if (chat.type === 'group') {
            onShowGroupInfo();
        } else if (chat.type === 'private' && !chat.isAiAssistant) {
            onShowContactInfo(chat.name);
        }
    };

    const getChatBgStyle = () => {
        const bg = user?.chatBackground;
        if (!bg) return { backgroundColor: '#fefcf7' };
        if (bg.startsWith('#')) {
            return { backgroundColor: bg };
        }
        if (bg === 'none') {
            return { backgroundColor: '#fefcf7' }; // cream-50
        }
        return { backgroundImage: `url('${bg}')` };
    }

    return (
        <div className={`flex flex-col h-full text-${user?.fontSize}`}>
            <header className="flex items-center p-3 bg-cream-100 border-b border-cream-200 shadow-sm z-10">
                <button onClick={onBack} className="md:hidden mr-3 p-2 rounded-full hover:bg-cream-200"><ArrowLeftIcon className="w-6 h-6 text-denim-800" /></button>
                <div className="flex-1 flex items-center cursor-pointer" onClick={handleHeaderClick}>
                    <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="ml-3">
                        <h2 className="font-semibold text-denim-900">{chat.name}</h2>
                        <p className="text-sm text-denim-600">{chat.type === 'group' ? `${chat.members?.length || 0} members` : 'online'}</p>
                    </div>
                </div>
                 {isSelectionMode ? (
                    <div className="flex items-center space-x-4">
                        <span className="font-semibold text-denim-800">{selectedMessages.size} selected</span>
                        <button onClick={confirmDelete} className="text-denim-700 hover:text-red-600 p-2 rounded-full hover:bg-cream-200"><TrashIcon className="w-6 h-6"/></button>
                        <button onClick={() => { setSelectionMode(false); setSelectedMessages(new Set()); }} className="text-denim-700 font-bold p-2">Cancel</button>
                    </div>
                ) : (
                     <div className="relative">
                        <button onClick={() => setMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-cream-200">
                            <EllipsisVerticalIcon className="w-6 h-6 text-denim-800"/>
                        </button>
                        {isMenuOpen && (
                             <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20" onMouseLeave={() => setMenuOpen(false)}>
                                <button 
                                    onClick={() => { onClearChat(chat.id); setMenuOpen(false); }}
                                    className="block w-full text-left px-4 py-2 text-sm text-denim-800 hover:bg-cream-100"
                                >
                                    Clear History
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </header>
            <div className="flex-1 p-6 overflow-y-auto bg-cover bg-center" style={getChatBgStyle()}>
                <div className="flex flex-col space-y-2">
                    {chat.messages.map(msg => (
                        <MessageBubble key={msg.id} message={msg} onLongPress={handleLongPress} onClick={handleMessageInteraction} isSelected={selectedMessages.has(msg.id)} isSelectionMode={isSelectionMode}/>
                    ))}
                </div>
                <div ref={messagesEndRef} />
            </div>
            <footer className="p-4 bg-cream-100 border-t border-cream-200">
                <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-denim-700 hover:text-denim-900 rounded-full hover:bg-cream-200"><ImageIcon className="w-6 h-6"/></button>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-denim-700 hover:text-denim-900 rounded-full hover:bg-cream-200"><FileIcon className="w-6 h-6"/></button>
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className={`flex-1 px-4 py-2 rounded-full bg-white border border-cream-300 focus:ring-2 focus:ring-denim-500 focus:outline-none text-${user?.fontSize}`}/>
                    <button type="submit" className="bg-denim-800 text-white p-3 rounded-full hover:bg-denim-900 transition-colors focus:outline-none focus:ring-2 focus:ring-denim-500"><SendIcon className="w-6 h-6" /></button>
                </form>
            </footer>
        </div>
    );
};

const MessageBubble: React.FC<{message: Message, isSelected: boolean, isSelectionMode: boolean, onLongPress: (id: number) => void, onClick: (id: number) => void}> = ({ message, isSelected, isSelectionMode, onLongPress, onClick }) => {
    const { user } = useAuth();
    const holdTimeout = useRef<number>();
    
    const handleMouseDown = () => { holdTimeout.current = window.setTimeout(() => onLongPress(message.id), 500); };
    const handleMouseUp = () => clearTimeout(holdTimeout.current);

    const MessageStatus = () => {
        if (message.sender !== 'me' || !message.status) return null;
        
        switch (message.status) {
            case 'sent':
                return <CheckIcon className="w-4 h-4 text-denim-300" />;
            case 'delivered':
                return <DoubleCheckIcon className="w-4 h-4 text-denim-300" />;
            case 'read':
                return <DoubleCheckIcon className="w-4 h-4 text-green-400" />;
            default:
                return null;
        }
    };
    
    const renderContent = () => {
        switch (message.type) {
            case 'image':
                return <img src={message.file?.url} alt={message.file?.name} className="rounded-lg max-w-full h-auto" />;
            case 'file':
                return <div className="flex items-center space-x-2"><FileIcon className="w-8 h-8 flex-shrink-0" /><span className="truncate">{message.file?.name}</span></div>;
            default:
                return <p className={`text-${user?.fontSize}`}>{message.text}</p>;
        }
    };

    return (
        <div onClick={() => onClick(message.id)} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp} className={`flex items-end gap-2 group ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            {isSelectionMode && (
                <div className="flex-shrink-0">
                    {isSelected ? <CheckCircleIcon className="w-6 h-6 text-denim-700"/> : <CircleIcon className="w-6 h-6 text-cream-300"/>}
                </div>
            )}
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl cursor-pointer transition-all ${isSelected ? 'ring-2 ring-denim-500' : ''} ${message.sender === 'me' ? 'bg-denim-800 text-white rounded-br-none' : 'bg-white text-denim-900 rounded-bl-none shadow'}`}>
                {renderContent()}
                 <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${message.sender === 'me' ? 'text-denim-300' : 'text-denim-500'}`}>
                    <span>{message.timestamp}</span>
                    <MessageStatus />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;