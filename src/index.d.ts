type FetchWithProgressHook = () => {
  progress: number;
  eta: number;
  reponse: Response;
  fetchWithProgress: FetchWithProgress;
};

type FetchWithProgress = (
  resource: RequestInfo | URL,
  options: RequestInit
) => Promise<Response>;
