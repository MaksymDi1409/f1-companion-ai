// app/api/openf1/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.openf1.org/v1${endpoint}`, {
      // Кешуємо на 1 годину, щоб не спамити зовнішнє API
      next: { revalidate: 3600 } 
    });
    
    if (!response.ok) {
      throw new Error(`OpenF1 API responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('OpenF1 Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to fetch from OpenF1' }, { status: 500 });
  }
}
