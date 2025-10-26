import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import type { UserProfile } from '../types';
import { CHAT_BACKGROUNDS, CHAT_BACKGROUND_COLORS } from '../constants';
import { MenuIcon } from './Icons';

interface SettingsPageProps {
    onMenuClick: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onMenuClick }) => {
    const { user, updateUser } = useAuth();
    const [settings, setSettings] = useState<Partial<UserProfile>>({});
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setSettings(user);
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };
    
    const handleUpdate = (update: Partial<UserProfile>) => {
        setSettings(prev => ({ ...prev, ...update }));
    };

    const handleSave = () => {
        updateUser(settings);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
    };

    if (!user) return null;

    return (
        <div className="flex-1 flex flex-col h-full bg-cream-50 overflow-y-auto">
            <header className="bg-cream-100 p-4 border-b border-cream-200 shadow-sm flex justify-between items-center">
                <div className="flex items-center">
                    <button onClick={onMenuClick} className="md:hidden mr-3 p-2 rounded-full hover:bg-cream-200">
                        <MenuIcon className="w-6 h-6 text-denim-800" />
                    </button>
                    <h1 className="text-2xl font-bold text-denim-800">Settings</h1>
                </div>
                <button onClick={handleSave} className="px-4 py-2 bg-denim-800 text-white font-semibold rounded-lg hover:bg-denim-900 transition-colors">
                    {saveSuccess ? 'Saved!' : 'Save Changes'}
                </button>
            </header>
            <div className="p-8 space-y-10">
                {/* Account Settings */}
                <section>
                    <h2 className="text-xl font-semibold text-denim-900 border-b-2 border-denim-200 pb-2 mb-4">Account</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Name" name="name" value={settings.name || ''} onChange={handleChange} />
                        <InputField label="Phone Number" name="phoneNumber" value={settings.phoneNumber || ''} onChange={handleChange} />
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-denim-700">Bio</label>
                             <textarea name="bio" value={settings.bio || ''} onChange={handleChange} className="mt-1 block w-full input-style" rows={3}></textarea>
                        </div>
                    </div>
                </section>
                
                {/* Chat Settings */}
                <section>
                    <h2 className="text-xl font-semibold text-denim-900 border-b-2 border-denim-200 pb-2 mb-4">Chat Settings</h2>
                    <div className="space-y-6">
                         <div>
                            <label className="block text-sm font-medium text-denim-700 mb-2">Chat Background Image</label>
                            <div className="flex flex-wrap gap-2">
                                {CHAT_BACKGROUNDS.map(bg => (
                                    <button key={bg} onClick={() => handleUpdate({ chatBackground: bg })} className={`w-20 h-14 rounded-lg border-2 bg-cover bg-center ${settings.chatBackground === bg ? 'border-denim-800 ring-2 ring-denim-500' : 'border-cream-300'}`} style={{ backgroundImage: bg !== 'none' ? `url('${bg}')` : 'none', backgroundColor: bg === 'none' ? '#fdf8ee' : '' }} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-denim-700 mb-2">Chat Background Color</label>
                            <div className="flex flex-wrap gap-2">
                                {CHAT_BACKGROUND_COLORS.map(color => (
                                    <button key={color} onClick={() => handleUpdate({ chatBackground: color })} className={`w-14 h-14 rounded-lg border-2 ${settings.chatBackground === color ? 'border-denim-800 ring-2 ring-denim-500' : 'border-cream-300'}`} style={{ backgroundColor: color }} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-denim-700 mb-2">Text Size</label>
                            <div className="flex space-x-2">
                                {(['sm', 'base', 'lg'] as const).map(size => (
                                    <button key={size} onClick={() => handleUpdate({ fontSize: size })} className={`px-4 py-2 rounded-lg ${settings.fontSize === size ? 'bg-denim-800 text-white' : 'bg-white text-denim-800 border border-cream-300'}`}>
                                        <span className={`text-${size}`}>Aa</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Notification Settings */}
                 <section>
                    <h2 className="text-xl font-semibold text-denim-900 border-b-2 border-denim-200 pb-2 mb-4">Notifications & Sounds</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                            <span className="font-medium text-denim-800">Message Tone</span>
                             <label className="px-3 py-1.5 bg-denim-100 text-denim-800 text-sm font-semibold rounded-md cursor-pointer hover:bg-denim-200">
                                Change
                                <input type="file" className="hidden" accept="audio/*" />
                            </label>
                        </div>
                    </div>
                </section>
            </div>
             <style>{`.input-style { display: block; width: 100%; border-radius: 0.375rem; border: 1px solid #f8e0be; background-color: #fff; padding: .5rem .75rem; color: #202a87; box-shadow: 0 1px 2px 0 rgba(0,0,0,.05); } .input-style:focus { outline:2px solid transparent; outline-offset:2px; border-color:#4d67ff; box-shadow: 0 0 0 2px #4d67ff } `}</style>
        </div>
    );
};

const InputField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-denim-700">{label}</label>
        <input type="text" id={name} name={name} value={value} onChange={onChange} className="mt-1 input-style" />
    </div>
);


export default SettingsPage;