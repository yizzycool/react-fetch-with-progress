type FetchWithProgress = (
  resource: RequestInfo | URL,
  options?: RequestInit
) => Promise<Response>;

type FetchWithProgressHook = () => {
  progress: number;
  eta: number;
  response: Response | null;
  fetchWithProgress: FetchWithProgress;
};
