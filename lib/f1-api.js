// lib/f1-api.js

/**
 * Ergast API - Офіційний F1 API для історичних даних
 * Документація: http://ergast.com/mrd/
 */

const ERGAST_API = 'https://ergast.com/api/f1';

/**
 * Отримує розклад поточного сезону
 */
export async function getCurrentSeasonSchedule() {
  try {
    const response = await fetch(`${ERGAST_API}/current.json`);
    const data = await response.json();
    return data.MRData.RaceTable.Races;
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
    
    // Знаходимо першу майбутню гонку
    const nextRace = races.find(race => {
      const raceDate = new Date(race.date + 'T' + race.time);
      return raceDate > now;
    });

    return nextRace || races[races.length - 1]; // Якщо сезон закінчився, повертаємо останню
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
    const response = await fetch(`${ERGAST_API}/current/driverStandings.json`);
    const data = await response.json();
    return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
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
    const response = await fetch(`${ERGAST_API}/current/constructorStandings.json`);
    const data = await response.json();
    return data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
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
    const response = await fetch(`${ERGAST_API}/current/last/results.json`);
    const data = await response.json();
    return data.MRData.RaceTable.Races[0];
  } catch (error) {
    console.error('Error fetching last race results:', error);
    return null;
  }
}

/**
 * Отримує інформацію про конкретний трек
 */
export async function getCircuitInfo(circuitId) {
  try {
    const response = await fetch(`${ERGAST_API}/circuits/${circuitId}.json`);
    const data = await response.json();
    return data.MRData.CircuitTable.Circuits[0];
  } catch (error) {
    console.error('Error fetching circuit info:', error);
    return null;
  }
}

/**
 * Отримує історію чемпіонств конкретного пілота
 */
export async function getDriverHistory(driverId) {
  try {
    const response = await fetch(`${ERGAST_API}/drivers/${driverId}/driverStandings/1.json`);
    const data = await response.json();
    return data.MRData.StandingsTable.StandingsLists || [];
  } catch (error) {
    console.error('Error fetching driver history:', error);
    return [];
  }
}

/**
 * Форматує дату та час гонки для відображення
 */
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

/**
 * Розраховує зворотній відлік до події
 */
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

/**
 * Отримує прапор країни за кодом
 */
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