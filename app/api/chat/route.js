// app/api/chat/route.js
import { createChatCompletion } from '@/lib/gemini';

export async function POST(request) {
  try {
    const { messages, f1Data } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request', { status: 400 });
    }

    // Передаємо f1Data в AI
    const stream = await createChatCompletion(messages, f1Data);

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.text?.() || '';
            
            if (content) {
              const text = `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`;
              controller.enqueue(encoder.encode(text));
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

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
