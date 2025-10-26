
import React from 'react';
import { MenuIcon } from './Icons';

interface GenericPageProps {
    title: string;
    message: string;
    onMenuClick: () => void;
}

const GenericPage: React.FC<GenericPageProps> = ({ title, message, onMenuClick }) => {
    return (
        <div className="flex-1 flex flex-col h-full">
            <header className="bg-cream-100 p-4 border-b border-cream-200 shadow-sm flex items-center">
                 <button onClick={onMenuClick} className="md:hidden mr-3 p-2 rounded-full hover:bg-cream-200">
                    <MenuIcon className="w-6 h-6 text-denim-800" />
                </button>
                <h1 className="text-2xl font-bold text-denim-800">{title}</h1>
            </header>
            <div className="flex-1 flex items-center justify-center p-6 bg-cream-50">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-denim-100">
                         <svg className="h-8 w-8 text-denim-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-2xl font-semibold text-denim-900">Coming Soon</h2>
                    <p className="mt-2 text-md text-denim-700">{message}</p>
                </div>
            </div>
        </div>
    );
};

export default GenericPage;