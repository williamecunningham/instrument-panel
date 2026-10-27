# Instrument Panel

A real-time telemetry dashboard built **the same way three times**: vanilla TypeScript, React, and Angular. One Node/WebSocket backend simulates three sensors (Fuel, RPM, Oil Pressure) and streams them to a browser, where live circular gauges render the data.

The point of the repo is comparison: same problem, same backend, three idiomatic frontends. Each approach is preserved as a git tag so you can check out and run it on its own.

## Versions at a glance

| | Vanilla TypeScript | React | Angular |
|---|---|---|---|
| **Git tag** | `vanilla-ts-version` | `react-version` | `angular-version` |
| **Folder (on `main`)** | `index.html`, `src/client.ts` | `client/` | `angular-client/` |
| **Gauge rendering** | Canvas 2D (imperative drawing) | SVG via JSX (declarative) | SVG via template bindings (declarative) |
| **State** | Local variables, redraw on each message | `useState` | Signals |
| **WebSocket handling** | `socket.onmessage` callback | `useEffect` with cleanup | RxJS `Observable` inside an injectable service |
| **Props / inputs** | Function parameters | Props interface | `input.required<T>()` |
| **Build tooling** | `tsc` | Vite | Angular CLI |
| **Dev server port** | 3000 (served by the Node backend) | 5173 | 4200 |

## Architecture

```
┌────────────────────┐   WebSocket (JSON)   ┌──────────────────────────┐
│  Node + ws server  │ ───────────────────▶ │  Browser frontend        │
│  src/server.ts     │   one message/tick   │  (vanilla | React | NG)  │
│  port 3000         │                      │                          │
└────────────────────┘                      └──────────────────────────┘
```

**Backend** (`src/server.ts`, TypeScript, run with Node):

- Holds a `Sensor[]` array: `{ name, value, unit }` for Fuel, RPM and Oil Pressure.
- Each tick, reads all sensors concurrently (`Promise.all`) through a simulated async read with a delay.
- Fuel drains steadily. RPM and Oil Pressure wander around a setpoint using random jitter plus a pull back toward center, so they stay in a plausible "normal flight" band.
- Broadcasts the full sensor array as JSON to every connected client, then reschedules itself with `setTimeout` (self-scheduling, so ticks can never overlap).
- Stops when Fuel reaches 0.
- Also serves `index.html` and the compiled `dist/` files over HTTP, which the vanilla frontend uses.

**Message shape** (identical for all three frontends):

```json
[
  { "name": "Fuel", "value": 76, "unit": "%" },
  { "name": "RPM", "value": 2382, "unit": "rpm" },
  { "name": "Oil Pressure", "value": 45, "unit": "psi" }
]
```

Gauge maximums (Fuel 100, RPM 2500, Oil Pressure 50) live in each frontend as a lookup keyed by sensor name, not in the data.

## Running it

### 1. Backend (required for every version)

From the repo root:

```bash
npm install
npm run build     # compiles src/ to dist/
npm start         # node dist/server.js, listens on port 3000
```

Leave this running. If a frontend shows empty gauges, check that the backend is still up first.

### 2a. Vanilla TypeScript

With the backend running, open <http://localhost:3000>. The Node server serves `index.html` and the compiled `dist/client.js`.

(Open it via `http://`, not by double-clicking the file. Browsers block ES modules loaded from `file://`.)

### 2b. React

```bash
cd client
npm install
npm run dev
```

Open <http://localhost:5173>.

### 2c. Angular

```bash
cd angular-client
npm install
npx ng serve
```

Open <http://localhost:4200>.

## Browsing each version via git tags

The tags are snapshots of the project as each frontend was completed:

```bash
git checkout vanilla-ts-version   # backend + vanilla Canvas frontend
git checkout react-version        # adds the Vite/React client
git checkout angular-version      # adds the Angular client
git checkout main                 # latest
```

Tags check out in "detached HEAD" state, which is fine for reading and running. Return to the latest with `git checkout main`.

## How the three frontends differ

**Vanilla TypeScript + Canvas.** You manage everything by hand: look up DOM elements, get a 2D context, and on every message clear and redraw each gauge with `ctx.arc(...)`. A `getCtx` helper uses an `instanceof HTMLCanvasElement` type guard to narrow `getElementById`'s `HTMLElement | null` result safely. Simple and fast, but all the "what changed, what do I redraw" bookkeeping is yours.

**React + SVG.** A `Gauge` component takes `value`, `maxValue` and `label` as props and returns SVG. The arc is a pure function of the props, so there is no manual redraw: new data arrives via `setSensors`, React re-renders, and the DOM updates to match. The WebSocket is opened once in a `useEffect` with a cleanup function.

**Angular + SVG.** Components are classes with a separate template file. The WebSocket lives in an injectable service that wraps the connection in an RxJS `Observable` (the async event stream) and writes each message into a Signal (the current state). Components inject the service and read the Signal directly in their templates. SVG attributes use `[attr.x]` bindings, and `@for` renders one gauge per sensor.

## Project layout (on `main`)

```
instrument-panel/
├── src/
│   ├── server.ts        # Node + WebSocket backend
│   └── client.ts        # vanilla TypeScript frontend
├── index.html           # vanilla frontend page
├── client/              # React (Vite) frontend
├── angular-client/      # Angular frontend
├── tsconfig.json
└── package.json         # backend + vanilla build scripts
```

`dist/` and `node_modules/` are build output and are git-ignored.

## Known limitations

- The static file handler in `server.ts` does not guard against path traversal (`/dist/../..`). Fine for local use, not production-safe.
- Missing files return a generic 500 instead of 404.
- The simulation halts permanently when Fuel hits 0; restart the backend to run it again.
- The `Sensor` interface is duplicated in each frontend rather than shared with the backend.

## Tech

TypeScript, Node.js, [`ws`](https://github.com/websockets/ws), React, Vite, Angular, RxJS, Canvas 2D, SVG.

