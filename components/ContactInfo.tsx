import React from 'react';
import type { Contact } from '../types';
import { CloseIcon, MessageIcon } from './Icons';

interface ContactInfoProps {
    contact: Contact;
    onClose: () => void;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ contact, onClose }) => {
    return (
        <div className="absolute top-0 right-0 h-full w-full md:w-1/3 lg:w-1/4 bg-cream-100 border-l border-cream-200 shadow-2xl flex flex-col z-20 animate-slide-in">
            <header className="flex items-center p-4 border-b border-cream-200">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-cream-200"><CloseIcon className="w-6 h-6 text-denim-800" /></button>
                <h2 className="text-xl font-bold text-denim-800 ml-4">Contact Info</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <img src={contact.avatar} alt={contact.name} className="w-32 h-32 rounded-full object-cover border-4 border-denim-200" />
                    <h1 className="text-2xl font-bold text-denim-900">{contact.name}</h1>
                    <p className="text-md text-denim-600">{contact.phoneNumber}</p>
                </div>

                <div className="border-t border-cream-200 pt-6">
                    <h3 className="text-sm font-semibold text-denim-600 mb-2">About</h3>
                    <p className="text-denim-900">{contact.bio || 'No bio available.'}</p>
                </div>
                 
            </div>
             <style>{`.animate-slide-in { animation: slideIn 0.3s ease-out forwards; } @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
        </div>
    );
};

export default ContactInfo;