import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../App';
import type { UserProfile } from '../types';
import { EditIcon, SaveIcon, CopyIcon, CameraIcon, MenuIcon } from './Icons';
import { PROFILE_COLORS } from '../constants';

interface ProfilePageProps {
    onMenuClick: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onMenuClick }) => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<UserProfile>>({});
    const [copySuccess, setCopySuccess] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user, isEditing]);

    if (!user) {
        return <div className="flex-1 flex items-center justify-center p-6 bg-cream-50"><p>Loading profile...</p></div>;
    }
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleColorChange = (color: string) => {
        setFormData({ ...formData, profileColor: color });
    };

    const handleSave = () => {
        updateUser(formData);
        setIsEditing(false);
    };

    const handleAvatarClick = () => {
        if(isEditing) {
            fileInputRef.current?.click();
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData({ ...formData, avatar: e.target?.result as string });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const copyToClipboard = () => {
        const link = `https://hud-hud.app/user/${user.name.replace(/\s+/g, '-').toLowerCase()}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopySuccess('Link copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed to copy!');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    const ProfileField = ({ label, value, name, isEditing }: { label: string; value: string; name: keyof UserProfile; isEditing: boolean }) => (
        <div>
            <label className="text-sm font-semibold text-denim-600">{label}</label>
            {isEditing ? (
                <input
                    type="text"
                    name={name}
                    value={formData[name] as string || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-md shadow-sm focus:outline-none focus:ring-denim-500 focus:border-denim-500 text-lg"
                />
            ) : (
                <p className="text-lg text-denim-900">{value || 'Not provided'}</p>
            )}
        </div>
    );

    return (
        <div className="flex-1 flex flex-col bg-cream-50 overflow-y-auto">
            <header className="bg-cream-100 p-4 border-b border-cream-200 shadow-sm flex justify-between items-center">
                <div className="flex items-center">
                     <button onClick={onMenuClick} className="md:hidden mr-3 p-2 rounded-full hover:bg-cream-200">
                        <MenuIcon className="w-6 h-6 text-denim-800" />
                    </button>
                    <h1 className="text-2xl font-bold text-denim-800">My Profile</h1>
                </div>
                <div>
                    <button onClick={copyToClipboard} className="p-2 rounded-full hover:bg-cream-200 transition-colors mr-2 relative">
                        <CopyIcon className="w-6 h-6 text-denim-800" />
                        {copySuccess && <span className="absolute -top-6 right-0 bg-denim-800 text-white text-xs px-2 py-1 rounded">{copySuccess}</span>}
                    </button>
                    {isEditing ? (
                        <button onClick={handleSave} className="p-2 rounded-full bg-denim-200 hover:bg-denim-300 transition-colors">
                            <SaveIcon className="w-6 h-6 text-denim-900" />
                        </button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-cream-200 transition-colors">
                            <EditIcon className="w-6 h-6 text-denim-800" />
                        </button>
                    )}
                </div>
            </header>
            <div className="flex-1 p-8" style={{ backgroundColor: formData.profileColor || user.profileColor }}>
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
                        <div className="relative">
                            <img src={formData.avatar || user.avatar} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-denim-200" />
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={handleAvatarClick}
                                    className="absolute bottom-0 right-0 bg-denim-800 text-white rounded-full p-2 hover:bg-denim-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-denim-500"
                                >
                                    <CameraIcon className="w-5 h-5" />
                                </button>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            {isEditing ? (
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="text-3xl font-bold text-denim-900 bg-cream-50 border-b-2 border-denim-300 focus:outline-none focus:border-denim-500 w-full text-center sm:text-left"/>
                            ) : (
                                <h2 className="text-3xl font-bold text-denim-900">{user.name}</h2>
                            )}
                            {isEditing ? (
                                <textarea name="bio" value={formData.bio} onChange={handleInputChange} className="text-md text-denim-700 mt-1 bg-cream-50 border-b-2 border-denim-300 focus:outline-none focus:border-denim-500 w-full h-20 resize-none text-center sm:text-left"/>
                            ) : (
                                <p className="text-md text-denim-700 mt-1">{user.bio || 'No bio available.'}</p>
                            )}
                        </div>
                    </div>
                    {isEditing && (
                        <div className="mt-6">
                            <label className="text-sm font-semibold text-denim-600">Profile Color</label>
                            <div className="flex space-x-2 mt-2">
                                {PROFILE_COLORS.map(color => (
                                    <button key={color} onClick={() => handleColorChange(color)} className={`w-8 h-8 rounded-full border-2 ${formData.profileColor === color ? 'border-denim-800 ring-2 ring-denim-500' : 'border-transparent'}`} style={{ backgroundColor: color }}/>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="mt-10 border-t border-cream-200 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ProfileField label="Phone Number" value={user.phoneNumber} name="phoneNumber" isEditing={isEditing} />
                        <ProfileField label="Email Address" value={user.email} name="email" isEditing={isEditing} />
                        <ProfileField label="Address" value={user.address} name="address" isEditing={isEditing} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;