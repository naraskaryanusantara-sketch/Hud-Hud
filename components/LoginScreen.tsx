import React, { useState, useRef, useCallback } from 'react';
import type { UserProfile } from '../types';
import { CameraIcon } from './Icons';
import { PROFILE_COLORS, CHAT_BACKGROUNDS } from '../constants';

interface LoginScreenProps {
  onLogin: (profile: UserProfile) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('https://picsum.photos/seed/avatar/200');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim().length > 5) {
      setStep(2);
    }
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and '+'
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^0-9+]/g, '');
    setPhoneNumber(sanitizedValue);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onLogin({ 
        phoneNumber, 
        name, 
        avatar, 
        bio, 
        address, 
        email,
        profileColor: PROFILE_COLORS[0],
        chatBackground: CHAT_BACKGROUNDS[0],
        fontSize: 'base',
      });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cream-50 p-4">
      <div className="w-full max-w-md bg-cream-100 rounded-2xl shadow-2xl p-8 transition-all duration-500">
        <h1 className="text-4xl font-bold text-denim-800 text-center mb-2">Hud-Hud</h1>
        <p className="text-center text-denim-700 mb-8">Your elegant messenger</p>

        {step === 1 && (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-denim-900">Enter Your Phone</h2>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-denim-700">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="+1 234 567 890"
                className="mt-1 block w-full px-4 py-3 bg-white border border-cream-300 rounded-md shadow-sm placeholder-denim-400 focus:outline-none focus:ring-denim-500 focus:border-denim-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-denim-800 hover:bg-denim-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-denim-500 transition-colors"
            >
              Continue
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-denim-900">Create Your Profile</h2>
             <div className="flex justify-center">
              <div className="relative">
                <img src={avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-cream-200" />
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 bg-denim-800 text-white rounded-full p-1.5 hover:bg-denim-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-denim-500"
                >
                  <CameraIcon className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-denim-700">Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full input-style" required />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-denim-700">Bio</label>
              <input id="bio" type="text" value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1 block w-full input-style" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-denim-700">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full input-style" required/>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-denim-700">Address</label>
              <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 block w-full input-style" />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-denim-800 hover:bg-denim-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-denim-500 transition-colors"
            >
              Start Chatting
            </button>
          </form>
        )}
      </div>
       <style>{`
          .input-style {
            padding: 0.75rem 1rem;
            background-color: white;
            border: 1px solid #f8e0be; /* cream-300 */
            border-radius: 0.375rem;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            color: #202a87; /* denim-900 */
          }
          .input-style::placeholder {
            color: #9cb8ff; /* denim-300 */
          }
          .input-style:focus {
            outline: none;
            box-shadow: 0 0 0 2px #4d67ff; /* ring-denim-500 */
            border-color: #4d67ff; /* border-denim-500 */
          }
        `}</style>
    </div>
  );
};

export default LoginScreen;