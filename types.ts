export interface UserProfile {
  phoneNumber: string;
  name: string;
  avatar: string;
  bio: string;
  address: string;
  email: string;
  profileColor: string; // New: For profile background
  chatBackground: string; // New: For chat background image or color
  fontSize: 'sm' | 'base' | 'lg'; // New: For chat text size
}

export interface Message {
  id: number;
  text: string;
  timestamp: string;
  sender: 'me' | 'other';
  isAi?: boolean;
  type: 'text' | 'image' | 'file'; // New: Message content type
  file?: { name: string; url: string }; // New: file data
  status?: 'sent' | 'delivered' | 'read'; // New: For message status ticks
}

export interface Chat {
  id: number;
  name:string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isAiAssistant?: boolean;
  messages: Message[];
  type: 'private' | 'group'; // New: To distinguish chat types
  members?: number[]; // New: Array of contact IDs for groups
}

export interface Contact {
  id: number;
  name: string;
  avatar: string;
  phoneNumber: string;
  bio?: string; // Add bio to contact for profile view
}