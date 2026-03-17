// app/page.js
'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Chat from '@/components/Chat';
import RaceSchedule from '@/components/RaceSchedule';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="flex h-screen app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="app-header px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                🏎️ F1 Companion AI
              </h1>
              <p className="text-sm mt-1">
                {activeTab === 'chat' 
                  ? 'Запитай мене про Формулу 1' 
                  : 'Розклад та standings'}
              </p>
            </div>
            
            <div className="text-xs quick-question-label text-right">
              <div>Powered by Google Gemini 3</div>
              <div>Data from OpenF1 API</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden">
          {activeTab === 'chat' && <Chat />}
          {activeTab === 'schedule' && <RaceSchedule />}
        </main>
      </div>
    </div>
  );
}
