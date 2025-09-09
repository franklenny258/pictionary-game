#!/bin/bash
(cd server && npm install && npm run dev) &
(cd web && npm install && npm run dev) &
(cd mobile && npm install && npm run start) &
wait