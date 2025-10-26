import React, { useState, useMemo, useRef } from 'react';
import type { Contact } from '../types';
import { PlusIcon, TrashIcon, CircleIcon, CheckCircleIcon, MenuIcon } from './Icons';
import AddContactModal from './AddContactModal';


interface ContactPageProps {
    contacts: Contact[];
    onAddContact: (contactData: { name: string, phoneNumber: string }) => void;
    onStartChat: (contact: Contact) => void;
    onMenuClick: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ contacts: initialContacts, onAddContact, onStartChat, onMenuClick }) => {
    const [contacts, setContacts] = useState<Contact[]>(initialContacts);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSelectionMode, setSelectionMode] = useState(false);
    const [selectedContacts, setSelectedContacts] = useState<Set<number>>(new Set());
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    
    React.useEffect(() => {
        setContacts(initialContacts);
    }, [initialContacts]);

    const filteredContacts = useMemo(() =>
        contacts.filter(contact =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [contacts, searchTerm]
    );

    const handleLongPress = (contactId: number) => {
        if (isSelectionMode) return;
        setSelectionMode(true);
        setSelectedContacts(new Set([contactId]));
    };

    const handleContactClick = (contact: Contact) => {
        if (isSelectionMode) {
            const newSelection = new Set(selectedContacts);
            if (newSelection.has(contact.id)) {
                newSelection.delete(contact.id);
            } else {
                newSelection.add(contact.id);
            }
            setSelectedContacts(newSelection);
        } else {
            onStartChat(contact);
        }
    };
    
    const confirmDelete = () => {
        setContacts(contacts.filter(c => !selectedContacts.has(c.id)));
        setSelectionMode(false);
        setSelectedContacts(new Set());
    };
    
    const handleAddContact = (contactData: { name: string, phoneNumber: string }) => {
        onAddContact(contactData);
        setAddModalOpen(false);
    };

    return (
        <>
            <div className="flex-1 flex flex-col h-full bg-cream-50">
                <header className="bg-cream-100 p-4 border-b border-cream-200 shadow-sm flex justify-between items-center">
                    <div className="flex items-center">
                        <button onClick={onMenuClick} className="md:hidden mr-3 p-2 rounded-full hover:bg-cream-200">
                            <MenuIcon className="w-6 h-6 text-denim-800" />
                        </button>
                        <h1 className="text-2xl font-bold text-denim-800">Contacts</h1>
                    </div>
                    {isSelectionMode && (
                        <div className="flex items-center space-x-4">
                            <span className="font-semibold text-denim-800">{selectedContacts.size} selected</span>
                            <button onClick={confirmDelete} className="text-denim-700 hover:text-red-600 p-2 rounded-full hover:bg-cream-200"><TrashIcon className="w-6 h-6"/></button>
                            <button onClick={() => { setSelectionMode(false); setSelectedContacts(new Set()); }} className="text-denim-700 font-bold p-2">Cancel</button>
                        </div>
                    )}
                </header>
                <div className="p-4">
                    <input type="text" placeholder="Search contacts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 rounded-full bg-white border border-cream-300 focus:ring-2 focus:ring-denim-500 focus:outline-none"/>
                </div>
                <div className="flex-1 overflow-y-auto px-4 relative">
                    {filteredContacts.map(contact => (
                        <ContactItem key={contact.id} contact={contact} onLongPress={handleLongPress} onClick={() => handleContactClick(contact)} isSelected={selectedContacts.has(contact.id)} isSelectionMode={isSelectionMode}/>
                    ))}
                    <button onClick={() => setAddModalOpen(true)} className="absolute bottom-6 right-6 bg-denim-800 text-white w-14 h-14 rounded-full shadow-lg hover:bg-denim-900 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-denim-500 flex items-center justify-center">
                        <PlusIcon className="w-8 h-8" />
                    </button>
                </div>
            </div>
            {isAddModalOpen && <AddContactModal onClose={() => setAddModalOpen(false)} onSave={handleAddContact} />}
        </>
    );
};

const ContactItem: React.FC<{contact: Contact, isSelected: boolean, isSelectionMode: boolean, onLongPress: (id: number) => void, onClick: () => void}> = ({ contact, isSelected, isSelectionMode, onLongPress, onClick }) => {
    const holdTimeout = useRef<number>();
    const handleMouseDown = () => { holdTimeout.current = window.setTimeout(() => onLongPress(contact.id), 500); };
    const handleMouseUp = () => clearTimeout(holdTimeout.current);

    return (
        <div onClick={onClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp} className={`flex items-center p-3 cursor-pointer transition-colors duration-200 rounded-lg mb-2 ${isSelected ? 'bg-denim-200' : 'hover:bg-cream-200'}`}>
            {isSelectionMode && (
                <div className="mr-4 flex-shrink-0">
                    {isSelected ? <CheckCircleIcon className="w-6 h-6 text-denim-700"/> : <CircleIcon className="w-6 h-6 text-cream-300"/>}
                </div>
            )}
            <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1 ml-4">
                <h3 className="font-semibold text-denim-900">{contact.name}</h3>
                <p className="text-sm text-denim-700">{contact.phoneNumber}</p>
            </div>
        </div>
    );
};

export default ContactPage;