import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function PATCH(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
        return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/library/start-reading`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: 'no-store',
    });

    const data = await response.json().catch(() => ({ error: 'Failed to parse response' }));
    return NextResponse.json(data, { status: response.status });
}