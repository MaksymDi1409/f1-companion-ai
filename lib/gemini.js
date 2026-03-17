// lib/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_API_KEY) {
  console.error("❌ GOOGLE_API_KEY не знайдено в .env.local");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/**
 * Створює AI відповідь з F1 контекстом
 * @param {Array} messages - Історія повідомлень
 * @param {Object} f1Data - Актуальні F1 дані (standings + розклад)
 */
 export async function createChatCompletion(messages, f1Data = null) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview"
    });

    // Беремо ТІЛЬКИ останнє повідомлення користувача
    const lastUserMessage = messages[messages.length - 1].content;

    const systemPrompt = `You are an F1 expert assistant with deep knowledge of Formula 1.

${f1Data ? `
🏎️ CURRENT F1 DATA (Last updated: ${new Date().toLocaleDateString('uk-UA')}):

${f1Data.standings ? `
📊 Driver Championship Standings (Top 10):
${f1Data.standings.map((s) => `${s.position}. ${s.driver} (${s.team}) — ${s.points} pts`).join('\n')}
` : ''}

${f1Data.nextRace ? `
🏁 Next Race Weekend:
📍 ${f1Data.nextRace.name}
🏟️ Circuit: ${f1Data.nextRace.circuit}
📌 Location: ${f1Data.nextRace.location}, ${f1Data.nextRace.country}

Schedule:
${f1Data.nextRace.sessions.map(s => `- ${s.name}: ${new Date(s.date).toLocaleString('uk-UA')}`).join('\n')}
` : ''}

⚠️ IMPORTANT: This is the CURRENT 2026 season data. Use ONLY this data when answering about:
- Current standings / championship positions / лідирує
- Who is leading / хто перший
- Next race schedule / наступна гонка
- Current season / цей сезон / 2026
- Points / очки / бали
- Recent results / останні результати

For historical questions (Senna, Schumacher, past seasons) use your general knowledge.
` : ''}

Your knowledge includes:
- Historical moments and legendary drivers (Senna, Schumacher, Hamilton, Verstappen, etc.)
- Current season data (2026) provided above
- Technical aspects (car regulations, tire strategies, DRS, ERS)
- Circuit information (track layouts, records, characteristics)
- Team histories and rivalries

Response style rules:
- Use natural, conversational tone (like talking to a friend, not giving a presentation)
- NO markdown headers (###), NO dividers (---), NO asterisks for lists
- Write in simple paragraphs and sentences
- Keep responses focused and concise (2-4 paragraphs for most questions)
- Answer in the same language the user writes in (English or Ukrainian)
- Be enthusiastic about F1 but don't be overly dramatic

Be helpful, friendly, and genuinely excited about F1!`;

    const fullPrompt = `${systemPrompt}\n\nUser: ${lastUserMessage}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Fake stream
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

/**
 * Генерує випадковий факт про F1
 */
export async function generateF1Fact() {
  const facts = [
    "Ayrton Senna виграв свою першу гонку під дощем у Monaco 1984!",
    "Monaco Grand Prix - єдина гонка де переможець отримує золотий кубок.",
    "Michael Schumacher — 7-разовий чемпіон світу (рекорд разом з Hamilton).",
    "Найшвидший пітстоп в історії - 1.82 секунди (Red Bull, 2019)!",
    "Lewis Hamilton має найбільше поул-позицій в історії - понад 100!",
  ];
  
  return facts[Math.floor(Math.random() * facts.length)];
}
