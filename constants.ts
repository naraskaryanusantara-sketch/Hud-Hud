import type { Chat, Contact } from './types';
import { MessageIcon, GroupIcon, ContactIcon, CallIcon, SettingsIcon, ProfileIcon } from './components/Icons';

export const NAV_ITEMS = [
    { name: 'Profile', icon: ProfileIcon, page: 'Profile' },
    { name: 'Chats', icon: MessageIcon, page: 'Chats' },
    { name: 'Groups', icon: GroupIcon, page: 'Groups' },
    { name: 'Contacts', icon: ContactIcon, page: 'Contacts' },
    { name: 'Calls', icon: CallIcon, page: 'Calls' },
    { name: 'Settings', icon: SettingsIcon, page: 'Settings' },
];

export const MOCK_CHATS: Chat[] = [
  {
    id: 0,
    name: 'Hud-Hud AI Assistant',
    avatar: `https://picsum.photos/seed/ai/200`,
    lastMessage: 'Ask me anything!',
    timestamp: 'Now',
    unreadCount: 1,
    isAiAssistant: true,
    type: 'private',
    messages: [
      {
        id: 1,
        text: 'Hello! I am your Hud-Hud AI assistant. How can I help you today?',
        timestamp: '10:00 AM',
        sender: 'other',
        isAi: true,
        type: 'text',
      }
    ]
  },
  {
    id: 1,
    name: 'Jane Doe',
    avatar: 'https://picsum.photos/seed/jane/200',
    lastMessage: 'Sounds good! See you then.',
    timestamp: '11:42 AM',
    unreadCount: 2,
    type: 'private',
    messages: [
        { id: 1, text: 'Hey, are we still on for lunch tomorrow?', timestamp: '11:40 AM', sender: 'other', type: 'text', status: 'read' },
        { id: 2, text: 'Yes! Thinking about that new Italian place.', timestamp: '11:41 AM', sender: 'me', type: 'text', status: 'read' },
        { id: 3, text: 'Sounds good! See you then.', timestamp: '11:42 AM', sender: 'other', type: 'text', status: 'delivered' },
    ]
  },
  {
    id: 2,
    name: 'John Smith',
    avatar: 'https://picsum.photos/seed/john/200',
    lastMessage: 'Can you send me the report?',
    timestamp: '10:30 AM',
    unreadCount: 0,
    type: 'private',
    messages: [
      { id: 1, text: 'Can you send me the report?', timestamp: '10:30 AM', sender: 'other', type: 'text', status: 'read' },
      { id: 2, text: 'Sure, I will send it in 5.', timestamp: '10:31 AM', sender: 'me', type: 'text', status: 'delivered' },
    ]
  },
  {
    id: 3,
    name: 'Project Team',
    avatar: 'https://picsum.photos/seed/team/200',
    lastMessage: 'Alice: Great job on the presentation!',
    timestamp: 'Yesterday',
    unreadCount: 5,
    type: 'group',
    members: [1, 2, 4], // Jane Doe, John Smith, Michael Brown
    messages: [
        { id: 1, text: 'Alice: Great job on the presentation!', timestamp: 'Yesterday', sender: 'other', type: 'text', status: 'read' },
        { id: 2, text: 'Thanks, Alice!', timestamp: 'Yesterday', sender: 'me', type: 'text', status: 'read' },
    ]
  },
  {
    id: 4,
    name: 'Emily White',
    avatar: 'https://picsum.photos/seed/emily/200',
    lastMessage: 'Happy Birthday! 🎉',
    timestamp: 'Yesterday',
    unreadCount: 0,
    type: 'private',
    messages: [
        { id: 1, text: 'Happy Birthday! 🎉', timestamp: 'Yesterday', sender: 'other', type: 'text', status: 'read' },
        { id: 2, text: 'Thank you so much!! 😊', timestamp: 'Yesterday', sender: 'me', type: 'text', status: 'sent' },
    ]
  },
  {
    id: 5,
    name: 'Family Group',
    avatar: 'https://picsum.photos/seed/family/200',
    lastMessage: 'Dad: Don\'t forget to pick up milk.',
    timestamp: '2 days ago',
    unreadCount: 0,
    type: 'group',
    members: [1, 5], // Jane Doe, Sarah Wilson
    messages: [
        { id: 1, text: 'Dad: Don\'t forget to pick up milk.', timestamp: '2 days ago', sender: 'other', type: 'text', status: 'read' },
    ]
  },
];

export const MOCK_CONTACTS: Contact[] = [
    { id: 1, name: 'Jane Doe', avatar: 'https://picsum.photos/seed/jane/200', phoneNumber: '+1-202-555-0184', bio: 'Designer & Dreamer.' },
    { id: 2, name: 'John Smith', avatar: 'https://picsum.photos/seed/john/200', phoneNumber: '+1-202-555-0162', bio: 'Just a simple guy.' },
    { id: 3, name: 'Emily White', avatar: 'https://picsum.photos/seed/emily/200', phoneNumber: '+1-202-555-0114', bio: 'Live, Laugh, Love.' },
    { id: 4, name: 'Michael Brown', avatar: 'https://picsum.photos/seed/michael/200', phoneNumber: '+1-202-555-0158', bio: 'Coffee enthusiast.' },
    { id: 5, name: 'Sarah Wilson', avatar: 'https://picsum.photos/seed/sarah/200', phoneNumber: '+1-202-555-0199', bio: 'Traveling the world.' },
];

export const PROFILE_COLORS = ['#dde7ff', '#c2d4ff', '#fbeed9', '#f8e0be', '#d1fae5', '#a7f3d0'];

export const CHAT_BACKGROUNDS = [
    'https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg',
    'https://www.wowpatterns.com/assets/files/resource_images/denim-and-cream-abstract-seamless-pattern.jpg',
    'https://i.pinimg.com/originals/a8/2e/72/a82e728954769f21e573a54245340656.jpg',
    'none'
];

export const CHAT_BACKGROUND_COLORS = [
  '#fefcf7', // cream-50
  '#fdf8ee', // cream-100
  '#fbeed9', // cream-200
  '#eff4ff', // denim-50
  '#dde7ff', // denim-100
  '#c2d4ff', // denim-200
  '#f0fdf4', // green-50
  '#dcfce7', // green-100
  '#fef2f2', // red-50
  '#fee2e2', // red-100
  '#fffbeb', // yellow-50
  '#fef3c7', // yellow-100
  '#f5f3ff', // violet-50
  '#ede9fe', // violet-100
];