/**
 * Fetch with progress (especially suitable for large file fetching)
 */
declare const useFetchWithProgress: () => {
    progress: number;
    eta: number;
    response: Response | null;
    fetchWithProgress: (resource: RequestInfo | URL, options?: {}) => Promise<Response>;
};
export { useFetchWithProgress };
export default useFetchWithProgress;
