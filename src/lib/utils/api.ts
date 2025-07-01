import { PUBLIC_API_URL, PUBLIC_BEARER_TOKEN } from '$env/static/public';

export async function fetchData(endpoint: string, options?: RequestInit) {
    const headers = new Headers(options?.headers);
    if (PUBLIC_BEARER_TOKEN) {
        headers.set('Authorization', `Bearer ${PUBLIC_BEARER_TOKEN}`);
    }
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${PUBLIC_API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}