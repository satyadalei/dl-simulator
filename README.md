# 🚦 DL Simulator (Driving License Simulator)

[![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Rapier Physics](https://img.shields.io/badge/Rapier_Physics-3D-red)](https://rapier.rs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**DL Simulator** is an interactive, browser-based 3D driving license simulation platform designed to teach and evaluate driving safety rules in real-time. Built with a high-performance **React + Three.js + TypeScript** stack, it bridges immersive 3D physics with lightweight, state-driven user interface overlays.

---

## ✨ Features

*   **🕹️ Physics-Driven Vehicle Dynamics** – Real-time steering, acceleration, braking, and collision physics powered by the `@react-three/rapier` 3D physics engine.
*   **🚦 Interactive Environment & Traffic** – Fully reactive environment including traffic lights, stop signs, pedestrian crosswalks, and interactive path-following NPC vehicles.
*   **📝 Rule Evaluation Engine** – Invisible physics sensor zones (Triggers) that monitor driving infractions (e.g., speeding, running red lights, failing to stop) in real-time.
*   **📊 Immersive HUD** – Sleek 2D HTML/CSS overlay showcasing a live speedometer, instruction panel, score/violation logs, and rearview mirror angles.
*   **🔈 Positional Spatial Audio** – Immersive 3D audio cues for engine acceleration, lane indicators, and collisions.

---

## 🛠️ Tech Stack

*   **Framework:** [React 19](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **3D Rendering:** [Three.js](https://threejs.org/) via [React Three Fiber (R3F)](https://github.com/pmndrs/react-three-fiber) & [@react-three/drei](https://github.com/pmndrs/drei)
*   **Physics Engine:** [@react-three/rapier](https://github.com/pmndrs/react-three-rapier) (WASM-powered Rapier Physics)
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Optimized 60 FPS state sync)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Testing:** [Vitest](https://vitest.dev/)

---

## 🏗️ Architecture Layout

The application utilizes a **Layered Component-Entity Architecture** to separate high-frequency 3D rendering and physics computations from UI state logic:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React Application Layer                         │
│  ┌───────────────────────┐   ┌──────────────────────────────────────┐  │
│  │   UI / HUD Component  │   │       Main Game Controller           │  │
│  │ (Speedometer, Alerts) │   │ (Score, Current Lesson, State Store) │  │
│  └───────────┬───────────┘   └──────────────────┬───────────────────┘  │
└──────────────│──────────────────────────────────│──────────────────────┘
               │ (Reads state)                    │ (Dispatches state)
               ▼                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       3D Engine Layer (R3F)                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                          <Canvas>                                │  │
│  │  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │  │
│  │  │   Environment   │  │ Vehicle Entity   │  │ Traffic System  │  │  │
│  │  │ (Roads, Signs)  │  │ (Physics Mesh)   │  │ (NPCs, Spawns)  │  │  │
│  │  └────────┬────────┘  └────────┬─────────┘  └────────┬────────┘  │  │
│  └───────────┼────────────────────┼─────────────────────┼───────────┘  │
└──────────────│────────────────────│─────────────────────│──────────────┘
               ▼                    ▼                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Core Engine & Physics Layer                        │
│ ┌───────────────────────────┐        ┌───────────────────────────────┐ │
│ │  Physics Engine (Rapier)  │◄──────►│     Instruction / Rules      │ │
│ │                           │        │     Evaluation Engine         │ │
│ └───────────────────────────┘        └───────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) and [pnpm](https://pnpm.io/) or [npm](https://www.npmjs.com/) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/dl-simulator.git
    cd dl-simulator
    ```

2.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

3.  **Install dependencies:**
    ```bash
    pnpm install
    # or
    npm install
    ```

4.  **Start the development server:**
    ```bash
    pnpm dev
    # or
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    pnpm build
    # or
    npm run build
    ```

---

## 🚦 Project Roadmap

*   **Phase 1:** Canvas setup, camera control, and basic rigid-body integration. *(Completed)*
*   **Phase 2:** Keyboard mapping, vehicle controller physics, and chase-camera logic. *(Completed)*
*   **Phase 3:** Low-poly environment construction and modular roadway props. *(In Progress)*
*   **Phase 4:** Invisible sensor trigger boxes, score manager, and instructional prompts. *(In Progress)*
*   **Phase 5:** Spatial sound effects, frame-rate profiling (via `r3f-perf`), and deployment.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
