// app/api/chat/route.js
import { createChatCompletion } from '@/lib/gemini';

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request', { status: 400 });
    }

    // Отримуємо streaming відповідь від Gemini
    const stream = await createChatCompletion(messages);

    // Створюємо ReadableStream для відправки клієнту
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text();
            
            if (text) {
              // Відправляємо chunk у форматі SSE (схожому на OpenAI)
              const data = {
                choices: [
                  {
                    delta: {
                      content: text,
                    },
                  },
                ],
              };
              
              const message = `data: ${JSON.stringify(data)}\n\n`;
              controller.enqueue(encoder.encode(message));
            }
          }

          // Сигналізуємо про завершення
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    // Повертаємо streaming response
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}