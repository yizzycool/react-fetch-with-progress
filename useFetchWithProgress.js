import { useState } from "react";

export default function useFetchWithProgress() {
  const [progress, setProgress] = useState(0);
  const [eta, setETA] = useState(0);
  const [blob, setBlob] = useState(null);
  const fetchWithProgress = (resource, options) => _fetchWithProgress(resource, options, [setProgress, setBlob, setETA]);
  return {progress, blob, eta, fetchWithProgress};
}

const _fetchWithProgress = (resource = '', options = null, setArrays) => {
  const response = fetch(resource, options);
  _processReponse(response, setArrays);
  return response;
};

const _processReponse = async (resourceResponse, setArrays) => {
  const [setProgress, setBlob, setETA] = setArrays;
  const response  = (await resourceResponse).clone();
  const reader = response.body.getReader();
  const contentLength = +response.headers.get('content-length');
  let receivedLength = 0;
  let chunks = [];
  const startTime = performance.now();
  while (true) {
    const {done, value} = await reader.read();
    const periodTime = performance.now() - startTime;
    if(done) {
      setProgress(100);
      setETA(0);
      break;
    }
    chunks.push(value);
    receivedLength += value.length;
    setProgress(receivedLength * 100 / contentLength);
    setETA(periodTime * (contentLength - receivedLength) / receivedLength);
  }
  setBlob(new Blob(chunks));
};