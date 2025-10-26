import React, { useState } from 'react';
import type { Chat, Contact } from '../types';
import ChatPage from './ChatPage';
import ProfilePage from './ProfilePage';
import GenericPage from './GenericPage';
import GroupPage from './GroupPage'; 
import ContactPage from './ContactPage';
import SettingsPage from './SettingsPage'; 
import GroupInfo from './GroupInfo';
import ContactInfo from './ContactInfo';
import { NAV_ITEMS, MOCK_CHATS, MOCK_CONTACTS } from '../constants';
import { useAuth } from '../App';
import { MenuIcon } from './Icons';

const MainApp = () => {
    const [activePage, setActivePage] = useState('Chats');
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
    const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
    const [isGroupInfoVisible, setGroupInfoVisible] = useState(false);
    const [viewedContact, setViewedContact] = useState<Contact | null>(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleSelectChat = (chat: Chat) => {
        const updatedChat = { 
            ...chat, 
            unreadCount: 0,
            messages: chat.messages.map(m => m.sender === 'other' ? { ...m, status: 'read' } : m)
        };
        setActiveChat(updatedChat);
        const updatedChats = chats.map(c => c.id === chat.id ? updatedChat : c);
        setChats(updatedChats);
        setActivePage('Chats');
    };

    const handleUpdateChat = (updatedChat: Chat) => {
        setChats(prev => prev.map(c => c.id === updatedChat.id ? updatedChat : c));
        if (activeChat?.id === updatedChat.id) {
            setActiveChat(updatedChat);
        }
    };
    
    const handleClearChat = (chatId: number) => {
        const updateChat = (chat: Chat) => ({ ...chat, messages: [], lastMessage: 'Chat history cleared' });
        setChats(prev => prev.map(c => c.id === chatId ? updateChat(c) : c));
        if (activeChat?.id === chatId) {
            setActiveChat(prev => prev ? updateChat(prev) : null);
        }
    };

    const handleShowContactInfo = (contactName: string) => {
        const contact = contacts.find(c => c.name === contactName);
        if (contact) {
            setViewedContact(contact);
        }
    };

    const handleAddContact = (contactData: { name: string, phoneNumber: string }) => {
        const newContact: Contact = {
            id: Date.now(),
            name: contactData.name,
            phoneNumber: contactData.phoneNumber,
            avatar: `https://picsum.photos/seed/${contactData.name}/200`,
        };
        setContacts(prev => [...prev, newContact]);
    };
    
    const handleStartNewChat = (contact: Contact) => {
        const existingChat = chats.find(chat => chat.type === 'private' && chat.name === contact.name);
        if (existingChat) {
            handleSelectChat(existingChat);
        } else {
            const newChat: Chat = {
                id: Date.now(),
                name: contact.name,
                avatar: contact.avatar,
                lastMessage: 'Chat started',
                timestamp: 'Now',
                unreadCount: 0,
                type: 'private',
                messages: []
            };
            setChats(prev => [newChat, ...prev]);
            handleSelectChat(newChat);
        }
    };
    
    const handleCreateGroup = (groupData: { name: string; avatar?: string; members: Contact[] }) => {
        const newGroupChat: Chat = {
            id: Date.now(),
            name: groupData.name,
            avatar: groupData.avatar || 'https://picsum.photos/seed/newgroup/200',
            lastMessage: `Group created with ${groupData.members.length} members.`,
            timestamp: 'Now',
            unreadCount: 0,
            type: 'group',
            messages: [],
            members: groupData.members.map(m => m.id),
        };
        setChats(prev => [newGroupChat, ...prev]);
        handleSelectChat(newGroupChat);
    };

    const renderContent = () => {
        const onMenuClick = () => setSidebarOpen(true);
        switch(activePage) {
            case 'Profile':
                return <ProfilePage onMenuClick={onMenuClick} />;
            case 'Chats':
                return <ChatPage 
                    chats={chats} setChats={setChats} contacts={contacts} activeChat={activeChat}
                    setActiveChat={setActiveChat} onSelectChat={handleSelectChat}
                    onStartNewChat={handleStartNewChat} onShowGroupInfo={() => setGroupInfoVisible(true)}
                    onShowContactInfo={handleShowContactInfo} onClearChat={handleClearChat}
                    onMenuClick={onMenuClick}
                />;
            case 'Groups':
                return <GroupPage 
                    chats={chats} contacts={contacts} onSelectChat={handleSelectChat}
                    onCreateGroup={handleCreateGroup} onMenuClick={onMenuClick}
                />;
            case 'Contacts':
                return <ContactPage 
                    contacts={contacts} onAddContact={handleAddContact}
                    onStartChat={handleStartNewChat} onMenuClick={onMenuClick}
                />;
            case 'Calls':
                return <GenericPage title="Calls" message="You haven't made or received any calls yet." onMenuClick={onMenuClick} />;
            case 'Settings':
                return <SettingsPage onMenuClick={onMenuClick} />;
            default:
                return <ChatPage 
                    chats={chats} setChats={setChats} contacts={contacts} activeChat={activeChat}
                    setActiveChat={setActiveChat} onSelectChat={handleSelectChat}
                    onStartNewChat={handleStartNewChat} onShowGroupInfo={() => setGroupInfoVisible(true)}
                    onShowContactInfo={handleShowContactInfo} onClearChat={handleClearChat}
                    onMenuClick={onMenuClick}
                />;
        }
    };
    
    return (
        <div className="flex h-screen w-screen bg-cream-50 relative overflow-hidden">
            <Sidebar 
                activePage={activePage} 
                setActivePage={setActivePage} 
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <main className="flex-1 flex flex-col overflow-hidden">
              {renderContent()}
            </main>
            {isGroupInfoVisible && activeChat && activeChat.type === 'group' && (
                <GroupInfo 
                    group={activeChat} 
                    contacts={contacts}
                    onClose={() => setGroupInfoVisible(false)} 
                    onUpdateGroup={handleUpdateChat}
                />
            )}
             {viewedContact && (
                <ContactInfo 
                    contact={viewedContact}
                    onClose={() => setViewedContact(null)}
                />
            )}
        </div>
    );
};

interface SidebarProps {
    activePage: string;
    setActivePage: (page: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, onClose }) => {
    const { user, logout } = useAuth();
    
    const handleNavClick = (page: string) => {
        setActivePage(page);
        onClose();
    };

    return (
        <>
            {/* Overlay for mobile */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Sidebar Panel */}
            <aside className={`
                bg-denim-900 text-cream-100 z-40 
                flex flex-col
                
                /* Mobile: Slide-in menu */
                fixed inset-y-0 left-0 w-64 h-full p-4 space-y-4
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}

                /* Desktop: Static narrow sidebar */
                md:relative md:w-20 md:py-6 md:px-2 md:space-y-6 md:translate-x-0
            `}>
                {/* Header with Avatar */}
                <div className="flex flex-col items-center text-center">
                    <button onClick={() => handleNavClick('Profile')} className="w-16 h-16 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-denim-600 focus:outline-none focus:ring-2 focus:ring-cream-100 flex-shrink-0">
                      <img src={user?.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                    </button>
                    <div className="md:hidden mt-2">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-xs text-denim-300">{user?.phoneNumber}</p>
                    </div>
                </div>
                
                <hr className="border-denim-700 md:hidden" />

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => handleNavClick(item.page)}
                            className={`
                                flex items-center w-full p-3 my-1 rounded-xl transition-colors duration-200 
                                justify-center md:justify-center
                                ${activePage === item.page ? 'bg-denim-700 text-white' : 'hover:bg-denim-800 text-cream-200'}
                            `}
                            aria-label={item.name}
                        >
                            <item.icon className="w-6 h-6 flex-shrink-0" />
                            <span className="ml-4 font-semibold md:hidden">{item.name}</span>
                        </button>
                    ))}
                </nav>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className="flex items-center w-full p-3 rounded-xl hover:bg-denim-800 text-cream-200 transition-colors duration-200 justify-center md:justify-center"
                    aria-label="Logout"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="ml-4 font-semibold md:hidden">Logout</span>
                </button>
            </aside>
        </>
    );
};

export default MainApp;