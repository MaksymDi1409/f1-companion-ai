// lib/f1-api.js
const OPENF1_API = 'https://api.openf1.org/v1';
const JOLPI_API = 'http://api.jolpi.ca/ergast/f1';
const CURRENT_YEAR = 2026;

// ============================================
// OpenF1 API — Розклад сесій
// ============================================

export async function getNextRaceWeekend() {
  try {
    const response = await fetch(
      `/api/openf1?endpoint=/sessions?year=${CURRENT_YEAR}`
    );
    const data = await response.json();
    
    const now = new Date();
    
    const meetings = {};
    data.forEach(session => {
      if (!meetings[session.meeting_key]) {
        meetings[session.meeting_key] = {
          meeting_key: session.meeting_key,
          meeting_name: session.meeting_official_name,
          country: session.country_name,
          location: session.location,
          circuit: session.circuit_short_name,
          sessions: [],
        };
      }
      meetings[session.meeting_key].sessions.push(session);
    });
    
    const upcomingMeetings = Object.values(meetings)
      .filter(meeting => {
        const lastSession = meeting.sessions[meeting.sessions.length - 1];
        return new Date(lastSession.date_end) > now;
      })
      .sort((a, b) => {
        const aDate = new Date(a.sessions[0].date_start);
        const bDate = new Date(b.sessions[0].date_start);
        return aDate - bDate;
      });
    
    return upcomingMeetings[0] || Object.values(meetings)[0];
  } catch (error) {
    console.error('Error fetching next race weekend:', error);
    return null;
  }
}

// ============================================
// Jolpi API — Standings (таблиця очок)
// ============================================

export async function getDriverStandings() {
  try {
    const response = await fetch(
      '/api/jolpi?endpoint=/current/driverStandings.json'
    );
    const data = await response.json();
    return data.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
  } catch (error) {
    console.error('Error fetching driver standings:', error);
    return [];
  }
}

export async function getConstructorStandings() {
  try {
    const response = await fetch(
      '/api/jolpi?endpoint=/current/constructorStandings.json'
    );
    const data = await response.json();
    return data.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
  } catch (error) {
    console.error('Error fetching constructor standings:', error);
    return [];
  }
}

// ============================================
// Допоміжні функції
// ============================================

export function formatDateTime(dateString, timezone = 'Europe/Kiev') {
  try {
    const date = new Date(dateString);
    
    return {
      date: date.toLocaleDateString('uk-UA', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone,
      }),
      full: date.toLocaleDateString('uk-UA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  } catch (error) {
    return { date: '', time: '', full: '' };
  }
}

export function getCountdown(dateString) {
  const now = new Date();
  const target = new Date(dateString);
  const diff = target - now;

  if (diff < 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days}д ${hours}г`;
  } else if (hours > 0) {
    return `${hours}г`;
  } else {
    return 'Скоро!';
  }
}

export function translateSessionName(sessionName) {
  const translations = {
    'Practice 1': 'Практика 1',
    'Practice 2': 'Практика 2',
    'Practice 3': 'Практика 3',
    'Qualifying': 'Кваліфікація',
    'Sprint': 'Спринт',
    'Sprint Qualifying': 'Спринт Кваліфікація',
    'Race': 'Гонка',
  };
  return translations[sessionName] || sessionName;
}
