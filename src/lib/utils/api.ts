import { PUBLIC_API_URL, PUBLIC_BEARER_TOKEN } from '$env/static/public';

export async function fetchData(endpoint: string, options?: RequestInit) {
    // strip any whitespace from the public API URL
    const sanitizedUrl = PUBLIC_API_URL.trim();
    const headers = new Headers(options?.headers);
    if (PUBLIC_BEARER_TOKEN) {
        headers.set('Authorization', `Bearer ${PUBLIC_BEARER_TOKEN}`);
    }
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${sanitizedUrl}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}