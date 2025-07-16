const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const fetcher = async<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type':'application/json',
            ...options?.headers,
        },
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fetch failed');
    }
    return await response.json();
}