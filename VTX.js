/**
 * VTX - Backend-as-a-Service Client Library
 * Just include this script and get instant backend features!
 * 
 * Usage: <script src="https://scripts.vtxgames.co.uk/vtx.js"></script>
 */

(function() {
  'use strict';
  
  const API_BASE = 'https://scripts.vtxgames.co.uk/api';
  const WS_BASE = 'wss://scripts.vtxgames.co.uk';
  
  // Helper function for API calls
  async function apiCall(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('VTX API Error:', error);
      throw error;
    }
  }
  
  // Main VTX object
  const VTX = {
    version: '1.0.0',
    
    // ==================== STORAGE ====================
    storage: {
      /**
       * Set a key-value pair
       * @param {string} key - Storage key
       * @param {any} value - Value to store (will be JSON stringified)
       */
      async set(key, value) {
        return await apiCall('/storage/set', {
          method: 'POST',
          body: JSON.stringify({ key, value })
        });
      },
      
      /**
       * Get a value by key
       * @param {string} key - Storage key
       */
      async get(key) {
        const result = await apiCall(`/storage/get/${encodeURIComponent(key)}`);
        return result.value;
      },
      
      /**
       * Delete a key
       * @param {string} key - Storage key to delete
       */
      async delete(key) {
        return await apiCall(`/storage/delete/${encodeURIComponent(key)}`, {
          method: 'DELETE'
        });
      },
      
      /**
       * List all keys and values
       */
      async list() {
        const result = await apiCall('/storage/list');
        return result.data;
      }
    },
    
    // ==================== LEADERBOARD ====================
    leaderboard: {
      /**
       * Submit a score to the leaderboard
       * @param {object} entry - { player, score, metadata? }
       */
      async submit({ player, score, metadata }) {
        return await apiCall('/leaderboard/submit', {
          method: 'POST',
          body: JSON.stringify({ player, score, metadata })
        });
      },
      
      /**
       * Get top scores
       * @param {number} limit - Number of entries (default: 10, max: 100)
       */
      async getTop(limit = 10) {
        const result = await apiCall(`/leaderboard/top/${limit}`);
        return result.leaderboard;
      },
      
      /**
       * Get rank for a specific player
       * @param {string} player - Player name
       */
      async getRank(player) {
        return await apiCall(`/leaderboard/rank/${encodeURIComponent(player)}`);
      }
    },
    
    // ==================== SESSIONS ====================
    sessions: {
      _currentSession: null,
      
      /**
       * Create a new session
       * @param {object} data - Initial session data
       */
      async create(data = {}) {
        const result = await apiCall('/sessions/create', {
          method: 'POST',
          body: JSON.stringify({ data })
        });
        this._currentSession = result.session_id;
        
        // Store in localStorage
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('vtx_session_id', result.session_id);
        }
        
        return result.session_id;
      },
      
      /**
       * Get current session or create new one
       */
      async get() {
        if (!this._currentSession && typeof localStorage !== 'undefined') {
          this._currentSession = localStorage.getItem('vtx_session_id');
        }
        
        if (!this._currentSession) {
          return await this.create();
        }
        
        try {
          const result = await apiCall(`/sessions/get/${this._currentSession}`);
          return result;
        } catch (error) {
          // Session not found, create new one
          return await this.create();
        }
      },
      
      /**
       * Update session data
       * @param {object} data - New session data
       */
      async update(data) {
        const sessionId = this._currentSession || await this.get().then(s => s.session_id);
        return await apiCall(`/sessions/update/${sessionId}`, {
          method: 'PUT',
          body: JSON.stringify({ data })
        });
      },
      
      /**
       * Get current session ID
       */
      getId() {
        return this._currentSession;
      }
    },
    
    // ==================== ANALYTICS ====================
    analytics: {
      /**
       * Track an event
       * @param {string} event - Event name
       * @param {object} data - Event data
       */
      async track(event, data = {}) {
        return await apiCall('/analytics/track', {
          method: 'POST',
          body: JSON.stringify({ event, data })
        });
      },
      
      /**
       * Get recent events
       * @param {number} limit - Number of events (default: 100)
       */
      async getEvents(limit = 100) {
        const result = await apiCall(`/analytics/events?limit=${limit}`);
        return result.events;
      },
      
      /**
       * Get event summary
       */
      async getSummary() {
        const result = await apiCall('/analytics/summary');
        return result.summary;
      }
    },
    
    // ==================== WEBHOOKS ====================
    webhooks: {
      /**
       * Register a webhook
       * @param {string} webhookId - Unique identifier for this webhook
       * @param {string} url - Webhook URL
       * @param {string} secret - Optional secret for authentication
       */
      async register(webhookId, url, secret) {
        return await apiCall('/webhooks/register', {
          method: 'POST',
          body: JSON.stringify({ webhook_id: webhookId, url, secret })
        });
      },
      
      /**
       * Send data to a registered webhook
       * @param {string} service - Webhook service ID
       * @param {object} data - Data to send
       */
      async send(service, data) {
        return await apiCall('/webhooks/send', {
          method: 'POST',
          body: JSON.stringify({ service, data })
        });
      }
    },
    
    // ==================== REAL-TIME ====================
    realtime: {
      _ws: null,
      _connected: false,
      _listeners: new Map(),
      _connectionPromise: null,
      
      /**
       * Connect to WebSocket
       */
      async connect() {
        if (this._connected) return;
        
        if (this._connectionPromise) {
          return this._connectionPromise;
        }
        
        this._connectionPromise = new Promise((resolve, reject) => {
          try {
            this._ws = new WebSocket(WS_BASE);
            
            this._ws.onopen = () => {
              this._connected = true;
              console.log('VTX: Connected to real-time server');
              resolve();
            };
            
            this._ws.onmessage = (event) => {
              try {
                const message = JSON.parse(event.data);
                
                if (message.type === 'message') {
                  const listeners = this._listeners.get(message.room);
                  if (listeners) {
                    listeners.forEach(callback => callback(message.data));
                  }
                }
              } catch (e) {
                console.error('VTX: WebSocket message error:', e);
              }
            };
            
            this._ws.onerror = (error) => {
              console.error('VTX: WebSocket error:', error);
              this._connected = false;
              reject(error);
            };
            
            this._ws.onclose = () => {
              this._connected = false;
              this._connectionPromise = null;
              console.log('VTX: Disconnected from real-time server');
              
              // Auto-reconnect after 3 seconds
              setTimeout(() => {
                if (this._listeners.size > 0) {
                  this.connect();
                }
              }, 3000);
            };
          } catch (error) {
            reject(error);
          }
        });
        
        return this._connectionPromise;
      },
      
      /**
       * Subscribe to a room
       * @param {string} room - Room name
       * @param {function} callback - Callback function for messages
       */
      async subscribe(room, callback) {
        await this.connect();
        
        if (!this._listeners.has(room)) {
          this._listeners.set(room, new Set());
        }
        this._listeners.get(room).add(callback);
        
        this._ws.send(JSON.stringify({
          type: 'subscribe',
          room
        }));
      },
      
      /**
       * Broadcast a message to a room
       * @param {string} room - Room name
       * @param {any} data - Data to broadcast
       */
      async broadcast(room, data) {
        await this.connect();
        
        this._ws.send(JSON.stringify({
          type: 'broadcast',
          room,
          data
        }));
      },
      
      /**
       * Unsubscribe from a room
       * @param {string} room - Room name
       * @param {function} callback - Optional specific callback to remove
       */
      unsubscribe(room, callback) {
        if (callback) {
          const listeners = this._listeners.get(room);
          if (listeners) {
            listeners.delete(callback);
            if (listeners.size === 0) {
              this._listeners.delete(room);
            }
          }
        } else {
          this._listeners.delete(room);
        }
      }
    },
    
    // ==================== DASHBOARD ====================
    dashboard: {
      /**
       * Get usage statistics
       */
      async getStats() {
        const result = await apiCall('/dashboard/stats');
        return result.stats;
      }
    }
  };
  
  // Auto-initialize session on page load
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      VTX.sessions.get().catch(() => {
        // Silent fail - session will be created on first use
      });
    });
  }
  
  // Expose VTX globally
  if (typeof window !== 'undefined') {
    window.VTX = VTX;
  }
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = VTX;
  }
  
  console.log('%c🚀 VTX Loaded!', 'color: #00ff00; font-size: 16px; font-weight: bold;');
  console.log('%cVisit https://vtxgames.co.uk for documentation', 'color: #888;');
})();
