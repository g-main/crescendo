# Crescendo

## Description
*A video game created as the final project for [SE 464](http://www.ucalendar.uwaterloo.ca/0708/COURSE/course-SE.html#SE464) at the University of Waterloo.*

Ever wanted to play Rockband or Guitar Hero, but didn't feel lke carrying around all the instruments? Well look no further!

Crescendo lets you realize your wildest musical dreams. Play alone or with friends - use your mobile devices to connect and add players, chose your song, and enjoy!

### Gameplay
To play, hit the corresponding button on your instrument as the note on screen strikes the bottom bar. Use audio cues to your advantage.

## Installation
1. Run `npm install` to install dependencies
2. Run `npm start` to start the server, frontend and their update listeners

**Note:** `npm start` runs `npm run frontend` and `npm run server` concurrently. The former sets up a `webpack` listener to keep updating the distribution bundles with frontend changes, and the latter spins up a server with `nodemon` for listening for backend changes.

## Linting
This codebase uses `eslint` for linting. `npm run lint` points to the local `node_modules`' `eslint` binary for ease of use. Sample usage: `npm run lint index.js`, although integration with IDE/text editor is highly encouraged.

## Authors
- Sameer Chitley
- Geoffrey Yu
- Hasya Shah
- Jami Boy Mohammad
