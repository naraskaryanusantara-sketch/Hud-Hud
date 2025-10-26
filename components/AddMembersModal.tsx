import React, { useState, useMemo } from 'react';
import type { Contact } from '../types';
import Modal from './Modal';
import { SearchIcon, CheckCircleIcon, CircleIcon } from './Icons';

interface AddMembersModalProps {
  contacts: Contact[];
  existingMembers: number[];
  onClose: () => void;
  onAddMembers: (newMemberIds: number[]) => void;
}

const AddMembersModal: React.FC<AddMembersModalProps> = ({ contacts, existingMembers, onClose, onAddMembers }) => {
  const [selectedContacts, setSelectedContacts] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const availableContacts = useMemo(() =>
    contacts.filter(contact =>
      !existingMembers.includes(contact.id) &&
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [contacts, existingMembers, searchTerm]
  );
  
  const handleToggleContact = (contactId: number) => {
    const newSelection = new Set(selectedContacts);
    if (newSelection.has(contactId)) {
      newSelection.delete(contactId);
    } else {
      newSelection.add(contactId);
    }
    setSelectedContacts(newSelection);
  };
  
  const handleAdd = () => {
    onAddMembers(Array.from(selectedContacts));
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Add Members">
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
        <div className="max-h-64 overflow-y-auto -mr-3 pr-3 space-y-1">
          {availableContacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => handleToggleContact(contact.id)}
              className="flex items-center p-2.5 cursor-pointer transition-colors duration-200 hover:bg-cream-200 rounded-lg"
            >
              <div className="mr-4">
                  {selectedContacts.has(contact.id) ? <CheckCircleIcon className="w-6 h-6 text-denim-700"/> : <CircleIcon className="w-6 h-6 text-cream-300"/>}
              </div>
              <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
              <h3 className="font-semibold text-denim-900 ml-3">{contact.name}</h3>
            </div>
          ))}
        </div>
         <div className="flex justify-end pt-4">
            <button
              onClick={handleAdd}
              disabled={selectedContacts.size === 0}
              className="px-4 py-2 bg-denim-800 text-white font-semibold rounded-lg hover:bg-denim-900 transition-colors disabled:bg-denim-300 disabled:cursor-not-allowed"
            >
              Add ({selectedContacts.size})
            </button>
          </div>
      </div>
    </Modal>
  );
};

export default AddMembersModal;