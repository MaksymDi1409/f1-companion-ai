// components/Sidebar.jsx
'use client';

import { MessageSquare, Calendar, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const [darkMode, setDarkMode] = useState(false);

  // Перевірка теми при завантаженні
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Перемикання теми
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const tabs = [
    {
      id: 'chat',
      name: 'Чат',
      icon: MessageSquare,
    },
    {
      id: 'schedule',
      name: 'Розклад',
      icon: Calendar,
    },
  ];

  return (
    <div className="w-20 bg-gray-900 text-white flex flex-col items-center py-6 space-y-6">
      {/* Логотип */}
      <div className="text-3xl font-bold mb-4">
        🏎️
      </div>

      {/* Навігація */}
      <div className="flex-1 space-y-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                isActive
                  ? 'bg-red-600 text-white shadow-lg scale-110'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              title={tab.name}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Перемикач теми */}
      <button
        onClick={toggleDarkMode}
        className="w-14 h-14 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        title={darkMode ? 'Світла тема' : 'Темна тема'}
      >
        {darkMode ? (
          <Sun className="w-6 h-6" />
        ) : (
          <Moon className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}