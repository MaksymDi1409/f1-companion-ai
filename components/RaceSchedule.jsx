// components/RaceSchedule.jsx
'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Trophy, Loader2 } from 'lucide-react';
import { getNextRace, getDriverStandings, formatRaceDateTime, getCountryFlag } from '@/lib/f1-api';

export default function RaceSchedule() {
  const [nextRace, setNextRace] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [race, driverStandings] = await Promise.all([
          getNextRace(),
          getDriverStandings(),
        ]);
        setNextRace(race);
        setStandings(driverStandings.slice(0, 5)); // Топ 5
      } catch (error) {
        console.error('Error loading race data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Наступна гонка */}
      {nextRace && (
        <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5" />
            <h2 className="text-lg font-bold">Наступна гонка</h2>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-2xl font-bold flex items-center gap-2">
                {getCountryFlag(nextRace.Circuit.Location.country)}
                {nextRace.raceName}
              </div>
              <div className="text-red-100 text-sm mt-1">
                Раунд {nextRace.round} • {nextRace.season}
              </div>
            </div>

            <div className="flex items-center gap-2 text-red-100">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {nextRace.Circuit.circuitName}, {nextRace.Circuit.Location.locality}
              </span>
            </div>

            <div className="flex items-center gap-2 text-red-100">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {formatRaceDateTime(nextRace.date, nextRace.time).date}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-red-500">
              <div className="text-sm text-red-100">Час (Київ):</div>
              <div className="text-xl font-bold">
                {formatRaceDateTime(nextRace.date, nextRace.time).time}
              </div>
              {formatRaceDateTime(nextRace.date, nextRace.time).countdown && (
                <div className="text-sm text-red-200 mt-1">
                  Через {formatRaceDateTime(nextRace.date, nextRace.time).countdown}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Standings */}
      {standings.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Топ-5 Пілотів
            </h2>
          </div>

          <div className="space-y-3">
            {standings.map((driver, index) => (
              <div
                key={driver.Driver.driverId}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                      index === 0
                        ? 'bg-yellow-400 text-yellow-900'
                        : index === 1
                        ? 'bg-gray-300 text-gray-800'
                        : index === 2
                        ? 'bg-orange-400 text-orange-900'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {driver.position}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {driver.Driver.givenName} {driver.Driver.familyName}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {driver.Constructors[0]?.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 dark:text-gray-100">
                    {driver.points}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Інформація */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4">
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
          💡 Запитай AI про деталі гонки, історію треку або статистику пілотів!
        </div>
      </div>
    </div>
  );
}