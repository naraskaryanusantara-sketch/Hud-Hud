import React, { useState, useMemo, useRef } from 'react';
import type { Chat, Contact } from '../types';
import { CloseIcon, EditIcon, CameraIcon, UserPlusIcon, ArrowRightOnRectangleIcon, SaveIcon } from './Icons';
import AddMembersModal from './AddMembersModal';

interface GroupInfoProps {
    group: Chat;
    contacts: Contact[];
    onClose: () => void;
    onUpdateGroup: (updatedGroup: Chat) => void;
}

const GroupInfo: React.FC<GroupInfoProps> = ({ group, contacts, onClose, onUpdateGroup }) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [groupName, setGroupName] = useState(group.name);
    const [groupAvatar, setGroupAvatar] = useState(group.avatar);
    const [isAddMembersModalOpen, setAddMembersModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const members = useMemo(() => 
        (group.members || []).map(memberId => 
            contacts.find(c => c.id === memberId)
        ).filter((c): c is Contact => c !== undefined),
        [group.members, contacts]
    );

    const handleNameSave = () => {
        onUpdateGroup({ ...group, name: groupName });
        setIsEditingName(false);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newAvatar = e.target?.result as string;
                setGroupAvatar(newAvatar);
                onUpdateGroup({ ...group, avatar: newAvatar });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleAddMembers = (newMemberIds: number[]) => {
        const updatedMembers = [...(group.members || []), ...newMemberIds];
        onUpdateGroup({ ...group, members: updatedMembers });
        setAddMembersModalOpen(false);
    };

    return (
        <>
            <div className="absolute top-0 right-0 h-full w-full md:w-1/3 lg:w-1/4 bg-cream-100 border-l border-cream-200 shadow-2xl flex flex-col z-20 animate-slide-in">
                <header className="flex items-center p-4 border-b border-cream-200">
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-cream-200"><CloseIcon className="w-6 h-6 text-denim-800" /></button>
                    <h2 className="text-xl font-bold text-denim-800 ml-4">Group Info</h2>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Group Header */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <img src={groupAvatar} alt={group.name} className="w-32 h-32 rounded-full object-cover border-4 border-denim-200" />
                             <button onClick={handleAvatarClick} className="absolute bottom-1 right-1 bg-denim-800 text-white rounded-full p-2 hover:bg-denim-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-denim-500">
                                <CameraIcon className="w-5 h-5" />
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        </div>
                        <div className="flex items-center space-x-2">
                             {isEditingName ? (
                                <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} className="text-2xl font-bold text-denim-900 bg-cream-50 border-b-2 border-denim-300 focus:outline-none focus:border-denim-500 text-center"/>
                            ) : (
                                <h1 className="text-2xl font-bold text-denim-900">{group.name}</h1>
                            )}
                             <button onClick={() => isEditingName ? handleNameSave() : setIsEditingName(true)} className="p-1.5 rounded-full hover:bg-cream-200">
                                {isEditingName ? <SaveIcon className="w-5 h-5 text-denim-800" /> : <EditIcon className="w-5 h-5 text-denim-800" />}
                            </button>
                        </div>
                        <p className="text-sm text-denim-600">Group ・ {members.length} members</p>
                    </div>

                    {/* Members List */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-denim-800">{members.length} Members</h3>
                        <div onClick={() => setAddMembersModalOpen(true)} className="flex items-center p-3 cursor-pointer text-denim-700 hover:bg-cream-200 rounded-lg">
                           <div className="w-10 h-10 bg-denim-200 rounded-full flex items-center justify-center">
                                <UserPlusIcon className="w-6 h-6" />
                            </div>
                            <span className="ml-4 font-semibold">Add members</span>
                        </div>
                        {members.map(member => (
                            <div key={member.id} className="flex items-center p-2">
                                <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                <span className="ml-4 font-medium text-denim-900">{member.name}</span>
                            </div>
                        ))}
                    </div>
                     {/* Actions */}
                    <div className="border-t border-cream-200 pt-6">
                        <button className="flex items-center w-full p-3 text-red-600 hover:bg-red-50 rounded-lg">
                           <ArrowRightOnRectangleIcon className="w-6 h-6"/>
                           <span className="ml-4 font-semibold">Leave Group</span>
                        </button>
                    </div>
                </div>
            </div>
             {isAddMembersModalOpen && (
                <AddMembersModal 
                    contacts={contacts}
                    existingMembers={group.members || []}
                    onClose={() => setAddMembersModalOpen(false)} 
                    onAddMembers={handleAddMembers}
                />
            )}
            <style>{`.animate-slide-in { animation: slideIn 0.3s ease-out forwards; } @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
        </>
    );
};

export default GroupInfo;