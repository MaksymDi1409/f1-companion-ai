// app/api/jolpi/route.js
// Проксі для Jolpi F1 API (обходить CORS)

const JOLPI_API = 'https://api.jolpi.ca/ergast/f1';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Missing endpoint parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Робимо запит до Jolpi API з сервера (обходимо CORS)
    const response = await fetch(`${JOLPI_API}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`Jolpi API error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600', // Кешуємо на 1 годину
      },
    });
  } catch (error) {
    console.error('Jolpi API Proxy Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Jolpi data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}