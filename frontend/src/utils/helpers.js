// API error handler utility
export function parseAPIError(error) {
  if (typeof error === 'string') return error;
  if (error && error.error) return error.error;
  if (error && error.message) return error.message;
  return 'An unexpected error occurred';
}

// Retry helper for network requests
export async function retryAsync(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
}

// Safe JSON parse
export function safeJSONParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

// Format time duration
export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

// Local storage with expiry
export const StorageManager = {
  set: (key, value, expiryMs = null) => {
    const data = { value, expiry: expiryMs ? Date.now() + expiryMs : null };
    localStorage.setItem(key, JSON.stringify(data));
  },
  get: (key) => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      const data = JSON.parse(stored);
      if (data.expiry && Date.now() > data.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return data.value;
    } catch {
      return null;
    }
  },
  remove: (key) => localStorage.removeItem(key),
};
