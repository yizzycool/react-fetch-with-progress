# react-fetch-with-progress


[![NPM Version](https://img.shields.io/npm/v/react-fetch-with-progress)](https://www.npmjs.com/package/react-fetch-with-progress)
[![npm downloads](https://img.shields.io/npm/dt/react-fetch-with-progress.svg)](https://www.npmjs.com/package/react-fetch-with-progress)
[![NPM Downloads](https://img.shields.io/npm/dw/react-fetch-with-progress)](https://www.npmjs.com/package/react-fetch-with-progress)
[![NPM License](https://img.shields.io/npm/l/react-fetch-with-progress)](https://www.npmjs.com/package/react-fetch-with-progress)


A React Hook for fetching data with download progress tracking.


## Installation

```bash
yarn add react-fetch-with-progress
```

or

```bash
npm i react-fetch-with-progress
```


## Hook Reference

### All-in-one hook

```js
const { progress, eta, response, fetchWithProgress } = useFetchWithProgress();
```

### Hook Returns

| Property | Type | Description |
|----------|------|-------------|
| `progress` | `number` | Current download progress (0 - 100). |
| `eta` | `number` | Estimated time remaining (in milliseconds). |
| `response` | `Response \| null` | The full `fetch` response object. |
| `fetchWithProgress` | `(url: string, options?: RequestInit) => Promise<Response>` | Function to start fetching with progress tracking. |


## API Reference

### `fetchWithProgress(url, options?)`

#### Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | The API endpoint to fetch data from. |
| `options` | `RequestInit` _(optional)_ | Optional fetch configuration (headers, method, body, etc.). |

#### Returns:
`Promise<Response>` - Resolves to the `fetch` response object.


## Example

```jsx
// React function component:
export default function App() {
  const { progress, eta, response, fetchWithProgress } = useFetchWithProgress();

  const url = 'https://example.com/image.jpg';

  const handleFetchImage = () => {
    // Same as native `fetch`
    fetchWithProgress(url)
      .then(response => {
        console.log("Fetch complete!", response);
      })
      .catch((error) => {
        console.error("Fetch failed:", error);
      });
  };

  // Listen to change for progress or eta
  useEffect(() => {
    console.log(`Progress: ${progress}% | ETA: ${eta}s`);
  }, [progress, eta]);
  
  return (
    <div>
      <button onClick={handleFetchImage}>Fetch Image</button>
      <div>
        Loading progress: 
        <progress max="100" value={progress ?? 0} />
        {progress.toFixed(1)}%
      </div>
      <div>ETA: {(eta / 1000).toFixed(1)}s</div>
    </div>
  )
}
```
