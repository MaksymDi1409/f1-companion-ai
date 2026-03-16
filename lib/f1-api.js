// lib/f1-api.js
// Використовуємо наш проксі замість прямих запитів до Ergast

const API_BASE = '/api/f1';

/**
 * Отримує розклад поточного сезону
 */
export async function getCurrentSeasonSchedule() {
  try {
    const response = await fetch(`${API_BASE}?endpoint=/current.json`);
    const data = await response.json();
    return data.MRData?.RaceTable?.Races || [];
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
}

/**
 * Отримує наступну гонку
 */
export async function getNextRace() {
  try {
    const races = await getCurrentSeasonSchedule();
    const now = new Date();
    
    const nextRace = races.find(race => {
      const raceDate = new Date(race.date + 'T' + race.time);
      return raceDate > now;
    });

    return nextRace || races[races.length - 1];
  } catch (error) {
    console.error('Error fetching next race:', error);
    return null;
  }
}

/**
 * Отримує поточні standings (Driver Championship)
 */
export async function getDriverStandings() {
  try {
    const response = await fetch(`${API_BASE}?endpoint=/current/driverStandings.json`);
    const data = await response.json();
    return data.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
  } catch (error) {
    console.error('Error fetching driver standings:', error);
    return [];
  }
}

/**
 * Отримує поточні standings (Constructor Championship)
 */
export async function getConstructorStandings() {
  try {
    const response = await fetch(`${API_BASE}?endpoint=/current/constructorStandings.json`);
    const data = await response.json();
    return data.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
  } catch (error) {
    console.error('Error fetching constructor standings:', error);
    return [];
  }
}

/**
 * Отримує результати останньої гонки
 */
export async function getLastRaceResults() {
  try {
    const response = await fetch(`${API_BASE}?endpoint=/current/last/results.json`);
    const data = await response.json();
    return data.MRData?.RaceTable?.Races?.[0] || null;
  } catch (error) {
    console.error('Error fetching last race results:', error);
    return null;
  }
}

// Інші функції залишаються без змін
export function formatRaceDateTime(date, time, timezone = 'Europe/Kiev') {
  try {
    const raceDate = new Date(date + 'T' + time);
    
    return {
      date: raceDate.toLocaleDateString('uk-UA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: raceDate.toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone,
      }),
      countdown: getCountdown(raceDate),
    };
  } catch (error) {
    return { date: date, time: time, countdown: null };
  }
}

export function getCountdown(targetDate) {
  const now = new Date();
  const diff = targetDate - now;

  if (diff < 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}д ${hours}г`;
  } else if (hours > 0) {
    return `${hours}г ${minutes}хв`;
  } else {
    return `${minutes}хв`;
  }
}

export function getCountryFlag(countryCode) {
  const flags = {
    'Bahrain': '🇧🇭',
    'Saudi Arabia': '🇸🇦',
    'Australia': '🇦🇺',
    'Azerbaijan': '🇦🇿',
    'USA': '🇺🇸',
    'Italy': '🇮🇹',
    'Monaco': '🇲🇨',
    'Spain': '🇪🇸',
    'Canada': '🇨🇦',
    'Austria': '🇦🇹',
    'UK': '🇬🇧',
    'Hungary': '🇭🇺',
    'Belgium': '🇧🇪',
    'Netherlands': '🇳🇱',
    'Singapore': '🇸🇬',
    'Japan': '🇯🇵',
    'Qatar': '🇶🇦',
    'Mexico': '🇲🇽',
    'Brazil': '🇧🇷',
    'UAE': '🇦🇪',
    'Las Vegas': '🇺🇸',
  };
  
  return flags[countryCode] || '🏁';
}