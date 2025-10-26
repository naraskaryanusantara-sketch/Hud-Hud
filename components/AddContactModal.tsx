import React, { useState } from 'react';
import Modal from './Modal';

interface AddContactModalProps {
  onClose: () => void;
  onSave: (contactData: { name: string, phoneNumber: string }) => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSave = () => {
    if (name.trim() && phoneNumber.trim()) {
      onSave({ name, phoneNumber });
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Add New Contact">
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-denim-700">Name</label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full input-style"
            required
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-denim-700">Phone Number</label>
          <input
            id="contact-phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full input-style"
            required
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-cream-200 text-denim-800 font-semibold rounded-lg hover:bg-cream-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-denim-800 text-white font-semibold rounded-lg hover:bg-denim-900 transition-colors"
          >
            Save Contact
          </button>
        </div>
      </form>
       <style>{`.input-style { display: block; width: 100%; border-radius: 0.375rem; border: 1px solid #f8e0be; background-color: #fff; padding: .5rem .75rem; color: #202a87; box-shadow: 0 1px 2px 0 rgba(0,0,0,.05); } .input-style:focus { outline:2px solid transparent; outline-offset:2px; border-color:#4d67ff; box-shadow: 0 0 0 2px #4d67ff } `}</style>
    </Modal>
  );
};

export default AddContactModal;