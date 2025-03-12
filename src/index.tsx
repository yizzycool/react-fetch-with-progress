import { useState } from "react";

export type FetchWithProgress = (
  resource: RequestInfo | URL,
  options?: RequestInit,
  callback?: FetchWithProgressCallback
) => Promise<Response>;

export type FetchWithProgressHook = () => {
  progress: number;
  eta: number;
  response: Response | null;
  fetchWithProgress: FetchWithProgress;
};

export type FetchWithProgressCallback = ({
  progress,
  eta,
}: {
  progress: number;
  eta: number;
}) => void;

type Setters = {
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setETA: React.Dispatch<React.SetStateAction<number>>;
  setResponse: React.Dispatch<React.SetStateAction<Response | null>>;
};

/**
 * Fetch with progress (especially suitable for large file fetching)
 */
const useFetchWithProgress: FetchWithProgressHook = () => {
  const [progress, setProgress] = useState<number>(0);
  const [eta, setETA] = useState<number>(0);
  const [response, setResponse] = useState<Response | null>(null);

  const fetchWithProgress: FetchWithProgress = (resource, options, callback) =>
    _fetchWithProgress(resource, options, callback, {
      setProgress,
      setETA,
      setResponse,
    });

  return { progress, eta, response, fetchWithProgress };
};

const _fetchWithProgress = (
  resource: RequestInfo | URL = "",
  options: RequestInit = {},
  callback: FetchWithProgressCallback = () => {},
  { setProgress, setETA, setResponse }: Setters
) => {
  // Fetch
  const responsePromise = fetch(resource, options);
  // Asynchronously update progress
  _processReponse(responsePromise, callback, {
    setProgress,
    setETA,
    setResponse,
  });
  return responsePromise;
};

/**
 * Update progress and ETA
 */
const _processReponse = async (
  responsePromise: Promise<Response>,
  callback: FetchWithProgressCallback,
  { setProgress, setETA, setResponse }: Setters
) => {
  const response = await responsePromise;
  setResponse(response);

  const clonedResponse = response.clone();
  const reader = clonedResponse.body?.getReader();
  if (!reader) return;

  // Get contentLength (in format of number) to calculate progress and ETA
  const contentLength = +(clonedResponse.headers.get("content-length") || 0);

  // Received data length so far
  let receivedLength = 0;
  // Received data chunks so far
  let chunks: Array<Uint8Array<ArrayBufferLike>> = [];

  const startTime = performance.now();

  while (true) {
    // Read data chunk
    const { done, value } = await reader.read();
    const periodTime = performance.now() - startTime;
    // If fetch completed
    if (done) {
      setProgress(100);
      setETA(0);
      break;
    }
    chunks.push(value);
    receivedLength += value.length;
    const progress = (receivedLength * 100) / contentLength;
    const eta =
      (periodTime * (contentLength - receivedLength)) / receivedLength;
    setProgress(progress);
    setETA(eta);
    callback({ progress, eta });
  }
};

export { useFetchWithProgress };
export default useFetchWithProgress;
