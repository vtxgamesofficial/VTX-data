VTX

VTX is a zero-setup backend for browser games and client-side websites.

It provides storage, leaderboards, player profiles, sessions, multiplayer rooms, real-time messaging, analytics, and webhooks through a single client script.

No account registration or API key is required.

Installation

Include the official hosted script in your HTML:

<script src="https://scripts.vtxgames.co.uk/vtx.js"></script>


The global VTX object will be available in your JavaScript environment.

Usage
Storage

Persistent key-value storage scoped automatically to the requesting domain.

await VTX.storage.set('mykey', { coins: 100 });

const data = await VTX.storage.get('mykey');

await VTX.storage.delete('mykey');

const all = await VTX.storage.list();

Leaderboards

Stores highest score per player and returns ranked results.

await VTX.leaderboard.submit({
  player: 'Alice',
  score: 9999
});

const top = await VTX.leaderboard.getTop(10);

const rank = await VTX.leaderboard.getRank('Alice');

Player Profiles

Save and retrieve structured player data.

await VTX.players.save('player123', {
  name: 'Alice',
  level: 5,
  coins: 1000,
  stats: { wins: 10, losses: 2 }
});

const player = await VTX.players.get('player123');

Sessions

Session state is automatically persisted via localStorage.

await VTX.sessions.update({ coins: 100 });

const session = await VTX.sessions.get();

Achievements

Unlock and retrieve achievements per player.

await VTX.achievements.unlock('player123', 'first-win');

const achievements = await VTX.achievements.get('player123');

Game Rooms

Create and manage multiplayer lobbies.

const room = await VTX.rooms.create('My Game', 4);

await VTX.rooms.join(room.roomId, 'player1', 'Alice');

const rooms = await VTX.rooms.list();

Real-Time Messaging

WebSocket-based publish/subscribe system.

VTX.realtime.connect();

VTX.realtime.subscribe('lobby', (message) => {
  console.log(message.data);
});

VTX.realtime.broadcast('lobby', {
  text: 'Hello'
});

Analytics

Track events and retrieve aggregated summaries.

VTX.analytics.track('level_complete', { level: 5 });

const summary = await VTX.analytics.summary();

Webhooks

Register and send webhook events.

await VTX.webhooks.register('discord', 'https://discord.com/api/webhooks/...');

await VTX.webhooks.send('discord', {
  content: 'New high score'
});

Architecture and Scope

Data is automatically isolated per domain.

HTTPS is required.

Designed for non-sensitive game and application data.

Not intended for high-scale enterprise workloads.

Rate limiting and abuse protection may apply.

License

Copyright (c) VTX

All rights reserved.

Permission is granted to use the official hosted script located at:

https://scripts.vtxgames.co.uk/vtx.js

for integration into websites and browser-based applications.

The following actions are strictly prohibited:

Modifying the source code

Redistributing the source code

Hosting a modified or unmodified copy of the script

Claiming authorship of the software

Rebranding the software

Creating derivative works

Use of the software is permitted only via the official hosted version.

For commercial licensing inquiries, contact the project owner.
