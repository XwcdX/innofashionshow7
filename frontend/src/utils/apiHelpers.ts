export const getBackendUrl = (path: string): string => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
        throw new Error(
            "Configuration Error: NEXT_PUBLIC_API_URL environment variable is not set. " +
            "Please ensure it's defined in your .env.local or environment configuration."
        );
    }

    const normalizedApiUrl = apiUrl.replace(/\/$/, '');
    const normalizedPath = path.replace(/^\//, '');

    return `${normalizedApiUrl}/${normalizedPath}`;
};