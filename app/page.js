// app/page.js
'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Chat from '@/components/Chat';
import RaceSchedule from '@/components/RaceSchedule';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                🏎️ F1 Companion AI
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {activeTab === 'chat' 
                  ? 'Запитай мене про Формулу 1' 
                  : 'Розклад та standings'}
              </p>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
              <div>Powered by OpenAI GPT-4</div>
              <div>Data from Ergast F1 API</div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          {activeTab === 'chat' && <Chat />}
          {activeTab === 'schedule' && <RaceSchedule />}
        </main>
      </div>
    </div>
  );
}
