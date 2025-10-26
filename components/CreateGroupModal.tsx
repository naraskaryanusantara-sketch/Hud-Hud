import React, { useState, useMemo } from 'react';
import type { Contact } from '../types';
import Modal from './Modal';
import { SearchIcon, CheckCircleIcon, CircleIcon } from './Icons';

interface CreateGroupModalProps {
  contacts: Contact[];
  onClose: () => void;
  onCreate: (groupData: { name: string; avatar?: string; members: Contact[] }) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ contacts, onClose, onCreate }) => {
  const [step, setStep] = useState(1);
  const [groupName, setGroupName] = useState('');
  const [groupAvatar, setGroupAvatar] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = useMemo(() =>
    contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [contacts, searchTerm]
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
  
  const handleNextStep = () => {
    if (selectedContacts.size > 0) {
      setStep(2);
    }
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedContacts.size > 0) {
      const members = contacts.filter(c => selectedContacts.has(c.id));
      onCreate({ name: groupName, avatar: groupAvatar, members });
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={step === 1 ? 'Add Members' : 'New Group'}>
      {step === 1 && (
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
            {filteredContacts.map(contact => (
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
                onClick={handleNextStep}
                disabled={selectedContacts.size === 0}
                className="px-4 py-2 bg-denim-800 text-white font-semibold rounded-lg hover:bg-denim-900 transition-colors disabled:bg-denim-300 disabled:cursor-not-allowed"
              >
                Next ({selectedContacts.size})
              </button>
            </div>
        </div>
      )}
      {step === 2 && (
         <form onSubmit={(e) => { e.preventDefault(); handleCreateGroup(); }} className="space-y-4">
            <div>
              <label htmlFor="group-name" className="block text-sm font-medium text-denim-700">Group Name</label>
              <input id="group-name" type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} className="mt-1 block w-full input-style" required />
            </div>
             <div>
              <label htmlFor="group-avatar" className="block text-sm font-medium text-denim-700">Group Avatar (Optional URL)</label>
              <input id="group-avatar" type="text" value={groupAvatar} onChange={(e) => setGroupAvatar(e.target.value)} className="mt-1 block w-full input-style" placeholder="https://..." />
            </div>
             <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={() => setStep(1)} className="px-4 py-2 bg-cream-200 text-denim-800 font-semibold rounded-lg hover:bg-cream-300 transition-colors">Back</button>
              <button type="submit" className="px-4 py-2 bg-denim-800 text-white font-semibold rounded-lg hover:bg-denim-900 transition-colors">Create Group</button>
            </div>
         </form>
      )}
       <style>{`.input-style { display: block; width: 100%; border-radius: 0.375rem; border: 1px solid #f8e0be; background-color: #fff; padding: .5rem .75rem; color: #202a87; box-shadow: 0 1px 2px 0 rgba(0,0,0,.05); } .input-style:focus { outline:2px solid transparent; outline-offset:2px; border-color:#4d67ff; box-shadow: 0 0 0 2px #4d67ff } `}</style>
    </Modal>
  );
};

export default CreateGroupModal;