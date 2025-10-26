import React, { useState, useMemo } from 'react';
import type { Contact } from '../types';
import Modal from './Modal';
import { SearchIcon } from './Icons';

interface NewChatModalProps {
  contacts: Contact[];
  onClose: () => void;
  onStartChat: (contact: Contact) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ contacts, onClose, onStartChat }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = useMemo(() =>
    contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [contacts, searchTerm]
  );

  return (
    <Modal isOpen={true} onClose={onClose} title="New Chat">
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-full bg-white border border-cream-300 focus:ring-2 focus:ring-denim-500 focus:outline-none"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-denim-400" />
        </div>
        <div className="max-h-80 overflow-y-auto -mr-3 pr-3">
          {filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <div
                key={contact.id}
                onClick={() => onStartChat(contact)}
                className="flex items-center p-3 cursor-pointer transition-colors duration-200 hover:bg-cream-200 rounded-lg"
              >
                <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="ml-3">
                  <h3 className="font-semibold text-denim-900">{contact.name}</h3>
                  <p className="text-sm text-denim-700">{contact.phoneNumber}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-denim-600 py-4">No contacts found.</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default NewChatModal;