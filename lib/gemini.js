// lib/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_API_KEY) {
  console.error("❌ GOOGLE_API_KEY не знайдено в .env.local");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/**
 * Перевіряє чи питання про актуальні дані F1
 */
function needsF1Data(message) {
  const keywords = [
    'standings', 'лідирує', 'championship', 'чемпіонат',
    'next race', 'наступна гонка', 'коли гонка',
    'last race', 'остання гонка', 'results', 'результати',
    'who won', 'хто виграв', 'переможець', 'winner',
    'points', 'очки', 'бали', 'топ', 'top'
  ];
  
  const lowerMessage = message.toLowerCase();
  return keywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Отримує актуальні дані F1 безпосередньо з Ergast
 * (викликається на backend, тому CORS немає)
 */
async function getF1Context() {
  try {
    const ERGAST_API = 'https://ergast.com/api/f1';
    
    // Робимо запити напряму до Ergast (працює на backend без CORS)
    const [standingsRes, scheduleRes] = await Promise.all([
      fetch(`${ERGAST_API}/current/driverStandings.json`),
      fetch(`${ERGAST_API}/current.json`)
    ]);

    const standingsData = await standingsRes.json();
    const scheduleData = await scheduleRes.json();

    const standings = standingsData.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
    const races = scheduleData.MRData?.RaceTable?.Races || [];
    const now = new Date();
    const nextRace = races.find(race => new Date(race.date + 'T' + race.time) > now);

    return {
      standings: standings.slice(0, 10).map(s => ({
        position: s.position,
        driver: `${s.Driver.givenName} ${s.Driver.familyName}`,
        team: s.Constructors[0]?.name,
        points: s.points
      })),
      nextRace: nextRace ? {
        name: nextRace.raceName,
        date: nextRace.date,
        circuit: nextRace.Circuit.circuitName,
        country: nextRace.Circuit.Location.country
      } : null,
      lastUpdate: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Error fetching F1 context:', error);
    return null;
  }
}

export async function createChatCompletion(messages) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview"
    });

    const lastMessage = messages[messages.length - 1].content;
    
    // Перевіряємо чи потрібні актуальні дані
    const needsData = needsF1Data(lastMessage);
    let f1Context = null;
    
    if (needsData) {
      console.log('🔍 Fetching F1 data for RAG...');
      f1Context = await getF1Context();
      console.log('✅ F1 data fetched:', f1Context ? 'Success' : 'Failed');
    }

    const systemPrompt = `You are an F1 expert assistant with deep knowledge of Formula 1.

${f1Context ? `
🏎️ CURRENT F1 DATA (Last updated: ${new Date().toLocaleDateString('uk-UA')}):

📊 Driver Championship Standings (Top 10):
${f1Context.standings.map((s, i) => `${s.position}. ${s.driver} (${s.team}) — ${s.points} pts`).join('\n')}

${f1Context.nextRace ? `🏁 Next Race: 
${f1Context.nextRace.name}
📍 Circuit: ${f1Context.nextRace.circuit}, ${f1Context.nextRace.country}
📅 Date: ${f1Context.nextRace.date}` : ''}

⚠️ IMPORTANT: Use ONLY this current data above to answer questions about:
- Current standings / championship positions
- Who is leading / лідирує
- Next race schedule
- Recent results

For historical questions (Senna, Schumacher, etc.) use your general knowledge.
` : ''}

Your knowledge includes:
- Historical moments and legendary drivers (Senna, Schumacher, Hamilton, Verstappen, etc.)
- Current season standings, race results, and upcoming races  
- Technical aspects (car regulations, tire strategies, DRS, ERS)
- Circuit information (track layouts, records, characteristics)
- Team histories and rivalries

Always provide:
- Accurate information based on current data when available
- Historical context when relevant
- Answer in the same language the user writes in (English or Ukrainian)

Be conversational, enthusiastic about F1, and help fans enjoy the sport more!`;

    const userMessages = messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .join('\n\n');

    const fullPrompt = `${systemPrompt}\n\nUser: ${userMessages}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Fake stream для ефекту
    async function* fakeStream() {
      const words = text.split(' ');
      for (const word of words) {
        yield { text: () => word + ' ' };
        await new Promise(resolve => setTimeout(resolve, 30));
      }
    }

    return fakeStream();
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    throw error;
  }
}

export async function generateF1Fact() {
  const facts = [
    "Ayrton Senna виграв свою першу гонку під дощем у Monaco 1984!",
    "Monaco Grand Prix - єдина гонка де переможець отримує золотий кубок.",
    "Michael Schumacher — 7-разовий чемпіон світу.",
    "Найшвидший пітстоп в історії - 1.82 секунди (Red Bull, 2019)!",
    "Lewis Hamilton має найбільше поул-позицій - понад 100!",
  ];
  
  return facts[Math.floor(Math.random() * facts.length)];
}