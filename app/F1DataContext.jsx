// app/F1DataContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getDriverStandings, getNextRaceWeekend } from '@/lib/f1-api';

const F1DataContext = createContext(null);

export function F1DataProvider({ children }) {
  const [f1Data, setF1Data] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const loadF1Data = async () => {
    try {
      console.log('🔄 Завантаження F1 даних...');
      setLoading(true);

      const [standings, weekend] = await Promise.all([
        getDriverStandings(),
        getNextRaceWeekend(),
      ]);

      const data = {
        standings: standings.slice(0, 10).map(s => ({
          position: s.position,
          driver: `${s.Driver.givenName} ${s.Driver.familyName}`,
          team: s.Constructors[0]?.name,
          points: s.points
        })),
        nextRace: weekend ? {
          name: weekend.meeting_name,
          circuit: weekend.circuit,
          location: weekend.location,
          country: weekend.country,
          sessions: weekend.sessions.map(s => ({
            name: s.session_name,
            date: s.date_start
          }))
        } : null,
      };

      setF1Data(data);
      setLastUpdate(new Date().toISOString());
      console.log('✅ F1 дані завантажені:', data);
    } catch (error) {
      console.error('❌ Помилка завантаження F1 даних:', error);
      setF1Data(null);
    } finally {
      setLoading(false);
    }
  };

  // Завантажуємо дані при першому рендері
  useEffect(() => {
    loadF1Data();
  }, []);

  return (
    <F1DataContext.Provider value={{ f1Data, loading, lastUpdate, refresh: loadF1Data }}>
      {children}
    </F1DataContext.Provider>
  );
}

export function useF1Data() {
  const context = useContext(F1DataContext);
  if (!context) {
    throw new Error('useF1Data must be used within F1DataProvider');
  }
  return context;
}
