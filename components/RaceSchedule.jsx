// components/RaceSchedule.jsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Trophy, Loader2, ExternalLink } from 'lucide-react';
import { 
  getNextRaceWeekend, 
  getDriverStandings,
  formatDateTime, 
  getCountdown, 
  translateSessionName 
} from '@/lib/f1-api';

export default function RaceSchedule() {
  const [raceWeekend, setRaceWeekend] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [weekend, driverStandings] = await Promise.all([
          getNextRaceWeekend(),
          getDriverStandings(),
        ]);
        setRaceWeekend(weekend);
        setStandings(driverStandings.slice(0, 5)); // Топ-5
      } catch (error) {
        console.error('Error loading race data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

// Генератор посилань для гонщиків із системою винятків
  const generateDriverUrl = (firstName, lastName) => {
    // 1. Створюємо базове ім'я
    const fullName = `${firstName}-${lastName}`.toLowerCase();
    let cleanName = fullName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/\s+/g, '-');

    // 2. Словник винятків (сюди додаємо всіх "проблемних" гонщиків)
    const exceptions = {
      'andrea-kimi-antonelli': 'kimi-antonelli',
      // 'guanyu-zhou': 'zhou-guanyu', // розкоментуй, якщо у Чжоу будуть проблеми
      // 'alexander-albon': 'alex-albon', // приклад на майбутнє
    };

    // 3. Якщо згенероване ім'я є у словнику, замінюємо його на правильне
    if (exceptions[cleanName]) {
      cleanName = exceptions[cleanName];
    }

    return `https://www.formula1.com/en/drivers/${cleanName}`;
  };

  const generateRaceUrl = (country) => {
    const formattedCountry = country.replace(/\s+/g, '_');
    return `https://www.formula1.com/en/racing/2026/${formattedCountry}.html`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--red-600)' }} />
      </div>
    );
  }

  if (!raceWeekend) {
    return (
      <div className="flex items-center justify-center h-full">
        <p style={{ color: 'var(--text-secondary)' }}>Немає даних про гонки</p>
      </div>
    );
  }

  const sortedSessions = [...raceWeekend.sessions].sort((a, b) => 
    new Date(a.date_start) - new Date(b.date_start)
  );

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
      
      {/* Заголовок вікенду — Ефект підняття (translate-y) */}
      <a 
        href={generateRaceUrl(raceWeekend.country)}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl p-6 shadow-md transition-all duration-300 cursor-pointer group relative hover:z-10 transform hover:-translate-y-1.5 hover:shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <h2 className="text-lg font-bold">Наступний Race Weekend</h2>
          </div>
          <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="space-y-3">
          <div className="text-2xl font-bold">
            {raceWeekend.meeting_name}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-red-100">
              <MapPin className="w-4 h-4 mt-0.5" />
              <div>
                <div className="text-xs font-medium text-red-200">Траса:</div>
                <div className="text-sm">{raceWeekend.circuit}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2 text-red-100">
              <MapPin className="w-4 h-4 mt-0.5" />
              <div>
                <div className="text-xs font-medium text-red-200">Розташування:</div>
                <div className="text-sm">{raceWeekend.location}, {raceWeekend.country}</div>
              </div>
            </div>
          </div>
        </div>
      </a>

      {/* Розклад сесій */}
      <div className="race-card rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5" style={{ color: 'var(--red-600)' }} />
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Розклад Сесій
          </h2>
        </div>

        <div className="space-y-3">
          {sortedSessions.map((session, index) => {
            const formatted = formatDateTime(session.date_start);
            const countdown = getCountdown(session.date_start);
            
            return (
              <div
                key={index}
                className="standings-item p-4 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {translateSessionName(session.session_name)}
                    </div>
                    <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {formatted.full}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {formatted.time}
                    </div>
                    {countdown && (
                      <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        через {countdown}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Standings - Top 5 — Ефект підняття (translate-y) */}
      {standings.length > 0 && (
        <div className="race-card rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5" style={{ color: 'var(--red-600)' }} />
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Топ-5 Пілотів
            </h2>
          </div>

          <div className="space-y-2">
            {standings.map((driver, index) => (
              <a
                key={driver.Driver.driverId}
                href={generateDriverUrl(driver.Driver.givenName, driver.Driver.familyName)}
                target="_blank"
                rel="noopener noreferrer"
                className="group standings-item flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 hover:shadow-md cursor-pointer relative hover:z-10 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shadow-sm ${
                      index === 0
                        ? 'bg-yellow-400 text-yellow-900'
                        : index === 1
                        ? 'bg-gray-300 text-gray-800'
                        : index === 2
                        ? 'bg-orange-400 text-orange-900'
                        : ''
                    }`}
                    style={
                      index > 2
                        ? {
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--text-primary)',
                          }
                        : undefined
                    }
                  >
                    {driver.position}
                  </div>
                  <div>
                    <div className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      {driver.Driver.givenName} {driver.Driver.familyName}
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-70 transition-opacity text-red-600" />
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {driver.Constructors[0]?.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold" style={{ color: 'var(--text-primary)' }}>
                    {driver.points}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    pts
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Інфо */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
          Більше інформації про гонки — у чаті. 💬
        </div>
      </div>
    </div>
  );
}
