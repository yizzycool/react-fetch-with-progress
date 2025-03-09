## React custom hook - useFetchWithProgress

### usage example

```js
// React function component:
export default function App() {
  const { progress, eta, response, fetchWithProgress } = useFetchWithProgress();
  const url = 'http[s]://something-to-fetch';

  const handleFetchImage = () => {
    fetchWithProgress(url)
      .then(response => {
        // same as native fetch
      })
  };

  // example: listen to change for progress or eta
  useEffect(() => {
    // YOUR PROCESS CODE HERE
  }, [progress, eta]);
  
  return (
    <div>
      <div onClick={handleFetchImage}>Fetch Image</div>
      <div>
        Loading progress: 
        <progress max="100" value={progress} />
        {progress.toFixed(1)}%
      </div>
      <div>ETA: {(eta / 1000).toFixed(1)}s</div>
    </div>
  )
}

```

### References
- [Fetch progress](https://javascript.info/fetch-progress)