import { useState } from "react";

/**
 * Fetch with progress (especially suitable for large file fetching)
 */
const useFetchWithProgress = () => {
  const [progress, setProgress] = useState<number>(0);
  const [eta, setETA] = useState<number>(0);
  const [response, setResponse] = useState<Response | null>(null);

  const fetchWithProgress: FetchWithProgress = (resource, options) =>
    _fetchWithProgress(resource, options, { setProgress, setETA, setResponse });

  return { progress, eta, response, fetchWithProgress };
};

const _fetchWithProgress = (
  resource: RequestInfo | URL = "",
  options: RequestInit = {},
  { setProgress, setETA, setResponse }
) => {
  // Fetch
  const responsePromise = fetch(resource, options);
  // Asynchronously update progress
  _processReponse(responsePromise, { setProgress, setETA, setResponse });
  return responsePromise;
};

/**
 * Update progress and ETA
 */
const _processReponse = async (
  responsePromise: Promise<Response>,
  { setProgress, setETA, setResponse }
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
    setProgress((receivedLength * 100) / contentLength);
    setETA((periodTime * (contentLength - receivedLength)) / receivedLength);
  }
};

export { useFetchWithProgress };
export default useFetchWithProgress;
