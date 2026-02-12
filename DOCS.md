# VTX Documentation

VTX is a zero-setup backend infrastructure layer for browser-based games and client-side web applications.

It provides storage, leaderboards, multiplayer rooms, real-time messaging, analytics, sessions, and webhooks — without requiring accounts, API keys, or server configuration.

---

# Table of Contents

- Installation
- Global Object
- Storage API
- Leaderboard API
- Players API
- Sessions API
- Achievements API
- Rooms API
- Realtime API
- Analytics API
- Webhooks API
- Error Handling
- Usage Guidelines
- Limitations

---

# Installation

Include the official hosted script in your HTML:

```html
<script src="https://scripts.vtxgames.co.uk/vtx.js"></script>
```

Once loaded, the global `VTX` object becomes available.

All async methods return Promises and should be used with `await`.

---

# Global Object

```
VTX
```

All functionality is accessed through namespaces under this object.

---

# Storage API

Persistent key-value storage scoped automatically to your domain.

## Set Value

```javascript
await VTX.storage.set(key, value);
```

### Parameters

- `key` (string)
- `value` (any serializable data)

## Get Value

```javascript
const value = await VTX.storage.get(key);
```

## Delete Value

```javascript
await VTX.storage.delete(key);
```

## List All Keys

```javascript
const keys = await VTX.storage.list();
```

---

# Leaderboard API

Stores highest score per player and provides ranking utilities.

## Submit Score

```javascript
await VTX.leaderboard.submit({
  player: string,
  score: number
});
```

## Get Top Players

```javascript
const top = await VTX.leaderboard.getTop(limit);
```

## Get Player Rank

```javascript
const rank = await VTX.leaderboard.getRank(playerName);
```

---

# Players API

Store structured player data.

## Save Player

```javascript
await VTX.players.save(playerId, dataObject);
```

## Get Player

```javascript
const player = await VTX.players.get(playerId);
```

---

# Sessions API

Session data automatically persists using localStorage.

## Update Session

```javascript
await VTX.sessions.update(dataObject);
```

## Get Session

```javascript
const session = await VTX.sessions.get();
```

---

# Achievements API

Track unique achievements per player.

## Unlock Achievement

```javascript
await VTX.achievements.unlock(playerId, achievementId);
```

## Get Achievements

```javascript
const achievements = await VTX.achievements.get(playerId);
```

---

# Rooms API

Create and manage multiplayer game rooms.

## Create Room

```javascript
const room = await VTX.rooms.create(name, maxPlayers);
```

## Join Room

```javascript
await VTX.rooms.join(roomId, playerId, displayName);
```

## List Rooms

```javascript
const rooms = await VTX.rooms.list();
```

---

# Realtime API

WebSocket-based publish/subscribe messaging.

## Connect

```javascript
VTX.realtime.connect();
```

## Subscribe

```javascript
VTX.realtime.subscribe(channel, callback);
```

## Broadcast

```javascript
VTX.realtime.broadcast(channel, dataObject);
```

Auto-reconnect is handled internally.

---

# Analytics API

Track custom events and retrieve aggregated summaries.

## Track Event

```javascript
VTX.analytics.track(eventName, dataObject);
```

## Get Summary

```javascript
const summary = await VTX.analytics.summary();
```

---

# Webhooks API

Send outbound webhook events.

## Register Webhook

```javascript
await VTX.webhooks.register(name, url);
```

## Send Webhook

```javascript
await VTX.webhooks.send(name, payload);
```

---

# Error Handling

All async functions return Promises and may throw errors.

Use standard try/catch patterns:

```javascript
try {
  await VTX.storage.set('key', 'value');
} catch (error) {
  console.error(error);
}
```

---

# Usage Guidelines

- Designed for browser-based applications.
- Not intended for sensitive or regulated data.
- Do not store secrets or authentication credentials.
- Follow rate limits and fair usage principles.
- HTTPS is required.

---

# Limitations

- No server-side validation.
- Not designed for high-scale enterprise workloads.
- Data isolation is domain-based.
- Availability depends on the hosted VTX infrastructure.

---

# Support

For licensing or commercial inquiries, contact the project owner.

Use of VTX is governed by the LICENSE file included in this repository.
