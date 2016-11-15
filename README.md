# Crescendo

## Installation
1. Run `npm install` to install dependencies
2. Run `npm start` to start the server, frontend and their update listeners

**Note:** `npm start` runs `npm run frontend` and `npm run server` concurrently. The former sets up a `webpack` listener to keep updating the distribution bundles with frontend changes, and the latter spins up a server with `nodemon` for listening for backend changes.

## Linting
This codebase uses `eslint` for linting. `npm run lint` points to the local `node_modules`' `eslint` binary for ease of use. Sample usage: `npm run lint index.js`, although integration with IDE/text editor is highly encouraged.
