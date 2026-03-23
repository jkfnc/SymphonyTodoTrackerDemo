# Symphony Todo Tracker Demo

A small dependency-light Todo Tracker used to validate Symphony end to end with both Claude and Codex.

## Scripts

- `npm start` runs the local server on `PORT` or `3000`
- `npm test` runs the unit tests
- `npm run screenshot -- --output artifacts/home.png` captures a browser screenshot with Puppeteer

## Features

- Create tasks
- Mark tasks complete
- Delete tasks
- Filter by all, active, completed
- Local persistence with `localStorage`
