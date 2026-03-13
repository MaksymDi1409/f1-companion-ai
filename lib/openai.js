// lib/openai.js
import OpenAI from 'openai';

// Ініціалізація OpenAI клієнта
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Створює streaming відповідь від AI з контекстом про F1
 */
export async function createChatCompletion(messages) {
  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Дешевша модель, добра для чатів
      messages: [
        {
          role: 'system',
          content: `You are an F1 expert assistant with deep knowledge of Formula 1 history, current season, drivers, teams, circuits, and technical regulations.

Your knowledge includes:
- Historical moments and legendary drivers (Senna, Schumacher, Hamilton, Verstappen, etc.)
- Current season standings, race results, and upcoming races
- Technical aspects (car regulations, tire strategies, DRS, ERS)
- Circuit information (track layouts, records, characteristics)
- Team histories and rivalries

Always provide:
- Accurate and engaging information
- Historical context when relevant
- Current season updates
- Answer in the same language the user writes in (English or Ukrainian)

Be conversational, enthusiastic about F1, and help fans enjoy the sport more!`,
        },
        ...messages,
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return stream;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

/**
 * Генерує швидкі факти про F1
 */
export async function generateF1Fact() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an F1 historian. Generate one interesting, lesser-known fact about Formula 1. Keep it under 100 words.',
        },
        {
          role: 'user',
          content: 'Give me a random interesting F1 fact',
        },
      ],
      temperature: 1.0,
      max_tokens: 150,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return 'Unable to generate fact at the moment.';
  }
}