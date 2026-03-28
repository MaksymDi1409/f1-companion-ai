// lib/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_API_KEY) {
  console.error("❌ GOOGLE_API_KEY не знайдено в .env.local");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/**
 * Визначає чи потрібні актуальні F1 дані для відповіді
 */
function needsCurrentData(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Ключові слова для актуальних даних (2026 сезон)
  const currentDataKeywords = [
    // Українські
    'лідирує', 'лідер', 'перший', 'таблиц', 'standings', 'очки', 'бали', 'points',
    'наступна гонка', 'коли гонка', 'розклад', 'schedule', 'де гонка',
    'цей сезон', '2026', '2025', '2024', 'поточний', 'зараз', 'сьогодні', 'актуальн',
    'хто виграв', 'останн', 'результат', 'нещодавн',
    
    // English
    'who is leading', 'current standings', 'next race', 'when is the race',
    'this season', 'latest', 'recent', 'current', 'now', 'today',
    'who won', 'last race', 'championship', 'points table',
  ];
  
  // Ключові слова для історичних питань (не потрібні API дані)
  const historicalKeywords = [
    'senna', 'schumacher', 'prost', 'fangio', 'lauda', 'piquet',
    'історія', 'history', 'колись', 'минуле', 'старі', 'легенд',
    'що таке', 'як працює', 'поясни', 'розкажи про',
    'drs', 'ers', 'підлога', 'аеродинаміка', 'шини', 'tire',
  ];
  
  // Якщо явно про історію - не потрібні актуальні дані
  const isHistorical = historicalKeywords.some(keyword => message.includes(keyword));
  if (isHistorical) return false;
  
  // Якщо є ключові слова актуальних даних - потрібні API
  return currentDataKeywords.some(keyword => message.includes(keyword));
}

/**
 * Вибирає доступну модель Gemini з фолбеками
 */
async function selectAvailableModel(useGoogleSearch = false) {
  // Пріоритет моделей (від найкращої до запасної)
  // УВАГА: Замінено ключ 'name' на 'model'
  const models = useGoogleSearch 
    ? [
        // З Google Search
        { model: "gemini-2.5-flash", tools: [{ googleSearch: {} }] }, // Рекомендую використовувати стабільні версії
        { model: "gemini-3.0-flash", tools: [{ googleSearch: {} }] }, // Залежить від того, які моделі доступні у твоєму проєкті
      ]
    : [
        // Без Google Search (для історичних питань)
        { model: "gemini-2.5-flash" },
        { model: "gemini-3.0-flash" },
      ];

  // Повертаємо першу модель
  return models[0];
}

/**
 * Створює AI відповідь з опціональним F1 контекстом та Google Search
 * @param {Array} messages - Історія повідомлень
 * @param {Object} f1Data - Актуальні F1 дані з API (опціонально)
 */
export async function createChatCompletion(messages, f1Data = null) {
  try {
    // Беремо ТІЛЬКИ останнє повідомлення користувача
    const lastUserMessage = messages[messages.length - 1].content;
    
    // Визначаємо чи потрібні актуальні дані
    const shouldUseCurrentData = needsCurrentData(lastUserMessage);
    
    // Вибираємо модель (з Google Search або без)
    const modelConfig = await selectAvailableModel(shouldUseCurrentData);
    const model = genAI.getGenerativeModel(modelConfig);
    
    // Якщо не потрібні актуальні дані - використовуємо простий промпт БЕЗ Google Search
    if (!shouldUseCurrentData) {
      const simplePrompt = `You are an F1 expert assistant with deep knowledge of Formula 1.

Your knowledge includes:
- Historical moments and legendary drivers (Senna, Schumacher, Hamilton, Verstappen, etc.)
- Technical aspects (car regulations, tire strategies, DRS, ERS, aerodynamics)
- Circuit information (track layouts, records, characteristics)
- Team histories and rivalries
- F1 rules and regulations

Response style rules:
- Use natural, conversational tone (like talking to a friend)
- NO markdown headers (###), NO dividers (---), NO asterisks for lists
- Write in simple paragraphs and sentences
- Keep responses focused and concise (2-4 paragraphs for most questions)
- Answer in the same language the user writes in (English or Ukrainian)
- Be enthusiastic about F1 but don't be overly dramatic

Be helpful, friendly, and genuinely excited about F1!

User: ${lastUserMessage}`;

      const result = await model.generateContent(simplePrompt);
      const response = await result.response;
      const text = response.text();
      
      return createFakeStream(text);
    }

    // Якщо потрібні актуальні дані - використовуємо ГІБРИДНИЙ підхід
    const enrichedPrompt = `You are an F1 expert assistant with deep knowledge of Formula 1.

🔍 YOU HAVE TWO SOURCES OF DATA:

${f1Data && (f1Data.standings || f1Data.nextRace) ? `
📊 PRIMARY SOURCE - STRUCTURED API DATA (use this FIRST):

${f1Data.standings ? `
Driver Championship Standings (Top 10):
${f1Data.standings.map((s) => `${s.position}. ${s.driver} (${s.team}) — ${s.points} pts`).join('\n')}
` : ''}

${f1Data.nextRace ? `
Next Race Weekend:
📍 ${f1Data.nextRace.name}
🏟️ Circuit: ${f1Data.nextRace.circuit}
📌 Location: ${f1Data.nextRace.location}, ${f1Data.nextRace.country}

Schedule:
${f1Data.nextRace.sessions.map(s => `- ${s.name}: ${new Date(s.date).toLocaleString('uk-UA')}`).join('\n')}
` : ''}

⚠️ This API data is for the CURRENT 2026 season and is HIGHLY RELIABLE.
` : ''}

🔍 SECONDARY SOURCE - GOOGLE SEARCH (use when API data is not enough):

You also have access to Google Search. Use it when:
- API data doesn't answer the specific question
- User asks about past seasons (2024, 2025) - API only has 2026
- User asks for details not in API data (race results, qualifying, team standings)
- User asks about news, rumors, or recent events

Search query examples:
- "F1 2025 championship final standings"
- "F1 2024 Abu Dhabi Grand Prix results"
- "Formula 1 latest news"

📋 USAGE STRATEGY:

1. IF question is about CURRENT 2026 season AND API data can answer → USE API DATA FIRST
2. IF question is about PAST seasons (2024, 2025) → USE GOOGLE SEARCH
3. IF API data exists but incomplete → COMBINE both sources
4. IF no API data available → USE GOOGLE SEARCH

Your general knowledge includes:
- Historical moments and legendary drivers (Senna, Schumacher, Hamilton, Verstappen, etc.)
- Technical aspects (car regulations, tire strategies, DRS, ERS)
- Circuit information (track layouts, records, characteristics)
- Team histories and rivalries

Response style rules:
- Use natural, conversational tone (like talking to a friend)
- NO markdown headers (###), NO dividers (---), NO asterisks for lists
- Write in simple paragraphs and sentences
- Keep responses focused and concise (2-4 paragraphs for most questions)
- Answer in the same language the user writes in (English or Ukrainian)
- Be enthusiastic about F1 but don't be overly dramatic
- When using data, present it naturally without saying "according to API" or "I searched"

Be helpful, friendly, and genuinely excited about F1!

User: ${lastUserMessage}`;

    const result = await model.generateContent(enrichedPrompt);
    const response = await result.response;
    const text = response.text();

    return createFakeStream(text);
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    throw error;
  }
}

/**
 * Створює fake streaming для плавного відображення тексту
 */
async function* createFakeStream(text) {
  const words = text.split(' ');
  for (const word of words) {
    yield { text: () => word + ' ' };
    await new Promise(resolve => setTimeout(resolve, 30));
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
    "Найдовша гонка в історії F1 тривала 4 години 4 хвилини (Канада, 2011).",
    "Fangio виграв свій останній чемпіонат у віці 46 років!",
    "У Monaco можна обігнати трасу пішки швидше ніж їде Safety Car.",
  ];
  
  return facts[Math.floor(Math.random() * facts.length)];
}
