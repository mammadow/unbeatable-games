const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class APIClient {
  constructor() {
    this.token = null;
    this.retries = 3;
  }

  getHeaders() {
    return {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    };
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
    }
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("token");
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    let lastError;

    // Retry logic for network failures
    for (let attempt = 0; attempt < this.retries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: { ...this.getHeaders(), ...(options.headers || {}) },
        });

        // Handle non-JSON responses
        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          data = { error: await response.text() };
        }

        // Check if response is OK
        if (!response.ok) {
          const error = data.error || `HTTP ${response.status}`;
          throw { error, status: response.status };
        }

        return data;
      } catch (err) {
        lastError = err;
        // Don't retry on 4xx errors
        if (err.status && err.status < 500) {
          throw err;
        }
        // Wait before retry
        if (attempt < this.retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }

    throw lastError || { error: "Network request failed" };
  }

  // Auth methods
  async register(username, email, password) {
    const data = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async login(email, password) {
    const data = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async guestLogin() {
    const data = await this.request("/auth/guest", {
      method: "POST",
      body: JSON.stringify({}),
    });
    this.setToken(data.token);
    return data;
  }

  // Game methods
  async recordGame(gameType, result, durationSeconds, userScore, aiScore) {
    return this.request("/games/record", {
      method: "POST",
      body: JSON.stringify({ gameType, result, durationSeconds, userScore, aiScore }),
    });
  }

  async getGameStats(gameType) {
    return this.request(`/games/stats/${gameType}`);
  }

  async getGameHistory(limit = 50) {
    return this.request(`/games/history?limit=${limit}`);
  }

  async getProfile() {
    return this.request("/games/profile");
  }

  // Leaderboard methods
  async getLeaderboard(gameType, limit = 100) {
    return this.request(`/leaderboard/${gameType}?limit=${limit}`);
  }

  async getUserRank(gameType) {
    return this.request(`/leaderboard/${gameType}/rank`);
  }

  async getGlobalLeaderboard(limit = 50) {
    return this.request(`/leaderboard?limit=${limit}`);
  }

  logout() {
    this.clearToken();
  }
}

// Create singleton instance
const apiClient = new APIClient();

// Restore token on init
const storedToken = localStorage.getItem("token");
if (storedToken) {
  apiClient.setToken(storedToken);
}

export default apiClient;
