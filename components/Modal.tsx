import React from 'react';
import type { ReactNode } from 'react';
import { CloseIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-cream-100 rounded-2xl shadow-2xl w-full max-w-md p-6 relative transition-transform transform scale-95 duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: isOpen ? 'scale(1)' : 'scale(0.95)'}}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-denim-800">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-cream-200 text-denim-700">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;