import { NextResponse } from 'next/server';

const API_URL = 'http://localhost:5113/api/Product';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('searchTerm') || '';
  const category = searchParams.get('category') || '';
  const take = searchParams.get('take') || '2'; // Default ke 50 jika tidak disediakan

  try {
    const response = await fetch(
      `${API_URL}/search?searchTerm=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}&take=${encodeURIComponent(take)}`
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
