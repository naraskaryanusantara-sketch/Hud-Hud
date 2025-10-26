import React, { useState, useMemo } from 'react';
import type { Chat, Contact } from '../types';
import { PlusIcon, MenuIcon } from './Icons';
import CreateGroupModal from './CreateGroupModal';

interface GroupPageProps {
    chats: Chat[];
    contacts: Contact[];
    onSelectChat: (chat: Chat) => void;
    onCreateGroup: (groupData: { name: string; avatar?: string; members: Contact[] }) => void;
    onMenuClick: () => void;
}

const GroupPage: React.FC<GroupPageProps> = ({ chats, contacts, onSelectChat, onCreateGroup, onMenuClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);

    const groupChats = useMemo(() =>
        chats.filter(chat =>
            chat.type === 'group' && chat.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [chats, searchTerm]
    );
    
    const handleCreateGroup = (groupData: { name: string; avatar?: string; members: Contact[] }) => {
        onCreateGroup(groupData);
        setCreateGroupModalOpen(false);
    }

    return (
        <>
            <div className="flex-1 flex flex-col h-full bg-cream-50">
                <header className="bg-cream-100 p-4 border-b border-cream-200 shadow-sm flex items-center">
                    <button onClick={onMenuClick} className="md:hidden mr-3 p-2 rounded-full hover:bg-cream-200">
                        <MenuIcon className="w-6 h-6 text-denim-800" />
                    </button>
                    <h1 className="text-2xl font-bold text-denim-800">Groups</h1>
                </header>
                <div className="p-4">
                    <input
                        type="text"
                        placeholder="Search groups..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 rounded-full bg-white border border-cream-300 focus:ring-2 focus:ring-denim-500 focus:outline-none"
                    />
                </div>
                <div className="flex-1 overflow-y-auto px-4 relative">
                    {groupChats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => onSelectChat(chat)}
                            className="flex items-center p-3 cursor-pointer transition-colors duration-200 hover:bg-cream-200 rounded-lg mb-2"
                        >
                            <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                            <div className="flex-1 ml-4 overflow-hidden">
                                <h3 className="font-semibold text-denim-900 truncate">{chat.name}</h3>
                                <p className="text-sm text-denim-700 truncate">{chat.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => setCreateGroupModalOpen(true)} className="absolute bottom-6 right-6 bg-denim-800 text-white w-14 h-14 rounded-full shadow-lg hover:bg-denim-900 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-denim-500 flex items-center justify-center">
                        <PlusIcon className="w-8 h-8" />
                    </button>
                </div>
            </div>
            {isCreateGroupModalOpen && (
                <CreateGroupModal
                    contacts={contacts}
                    onClose={() => setCreateGroupModalOpen(false)}
                    onCreate={handleCreateGroup}
                />
            )}
        </>
    );
};

export default GroupPage;