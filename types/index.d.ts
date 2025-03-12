export type FetchWithProgress = (resource: RequestInfo | URL, options?: RequestInit, callback?: FetchWithProgressCallback) => Promise<Response>;
export type FetchWithProgressHook = () => {
    progress: number;
    eta: number;
    response: Response | null;
    fetchWithProgress: FetchWithProgress;
};
export type FetchWithProgressCallback = ({ progress, eta, }: {
    progress: number;
    eta: number;
}) => void;
declare const useFetchWithProgress: FetchWithProgressHook;
export { useFetchWithProgress };
export default useFetchWithProgress;
