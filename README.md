# Ever Smart Browser — Web edition

A responsive React 19 + TypeScript workspace powered by Vite. This project runs entirely on the web and no longer requires Expo, React Native, mobile emulators, or native modules.

## Development

Use Node.js 22 or later. Run `npm ci`, then `npm run dev` for the interface. For the complete application, including the library API, use `netlify dev --port 8889`.

`npm run typecheck` checks the client and server TypeScript. `npm test` checks address handling. `npm run build` produces the deployment in `dist`; Netlify runs this automatically.

## Features

- Search with Google or DuckDuckGo, or open an HTTP/HTTPS address.
- Five bilingual English/Urdu hubs with the original curated links.
- Bookmarks with add, open, filter, and delete actions.
- Workspace history with filtering, individual removal, and clearing.
- Audio and video playback using browser file selection; files are not uploaded.
- Responsive layouts and a light/dark theme switch.

External links open in real browser tabs. This avoids embedding restrictions imposed by many websites. Use your browser's controls for private windows, downloads, passwords, permissions, VPN extensions, and ad blocking. This app does not claim to provide those native browser capabilities.

## Storage and deployment

Bookmarks and history use Netlify Database through Drizzle and the `/api/library` Netlify Function. Records are scoped to an anonymous browser identity carried in an HttpOnly, Secure, SameSite cookie. Clearing cookies disconnects that browser from its saved library; there is no account recovery or cross-device synchronization. Theme and search-engine choices apply to the current page session.

The schema is in `db/schema.ts`; migrations are in `netlify/database/migrations`. Netlify provisions the database and applies migrations during deployment. Do not manually apply migrations. The library API returns an error if storage is unavailable; it does not report an unsaved bookmark as saved.

The SPA fallback in `netlify.toml` supports direct navigation. The build uses Vite and publishes `dist`.
