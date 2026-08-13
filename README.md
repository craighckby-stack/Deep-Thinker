# Deep Thinker — Gemini 3.6 Flash Reasoning Engine

**Deep Thinker** is a high-performance AI chat interface and architectural reasoning tool built with **Gemini 3.6 Flash**, **Express**, **React 19**, and **Tailwind CSS**. It provides configurable thinking levels, real-time telemetry metrics, automated quota-resilient retries, and pre-built reasoning prompt templates.

---

## 📁 Files Used from Attached Zips & Repositories

### 1. Active Application Workspace Files
- **`server.ts`**: Express backend proxy server that manages Gemini API calls server-side, exposes `/api/chat`, `/api/health`, and `/api/system/scaffold` endpoints, handles thinking level parameters (`ThinkingLevel.HIGH` / `LOW` / `OFF`), and provides automatic failover retries.
- **`src/App.tsx`**: Main React frontend interface equipped with a thinking mode switcher (`High`, `Low`, `Off`), live telemetry banner, reasoning prompt presets, markdown rendering, message copying, latency indicators, and clear-chat controls.
- **`src/index.css`**: Global stylesheet featuring Tailwind CSS v4 and `@tailwindcss/typography` formatting.
- **`src/main.tsx`**: Client entry point rendering the React application root.
- **`package.json`**: Application manifest containing active dependencies (`@google/genai`, `express`, `react`, `react-markdown`, `lucide-react`, `motion`, `dotenv`, `@tailwindcss/vite`).
- **`metadata.json`**: AI Studio platform configuration specifying major capabilities (`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`).
- **`index.html`**: Primary HTML document container.
- **`.env.example`**: Environment template declaring `GEMINI_API_KEY`.
- **`vite.config.ts`**: Vite configuration supporting React and Tailwind plugins with SPA middleware mode.
- **`tsconfig.json`**: TypeScript compiler configuration.

### 2. Scaffold & AGI Ecosystem Reference Files (Imported Repository Logs)
- **Foundational Knowledge & Diagnostics**:
  - `00_Foundational_Knowledge/encyclopedia_of_engineering/knowledge_types.py`
  - `00_Foundational_Knowledge/encyclopedia_of_engineering/knowledge_registry.py`
  - `00_Foundational_Knowledge/encyclopedia_of_engineering/knowledge_base.py`
  - `00_Foundational_Knowledge/encyclopedia_of_engineering/diagnostic_engine.py`
- **Generative Architecture & Simulation**:
  - `01_Generative_Architect/diagnostic_engine_core.py`
  - `01_Generative_Architect/diagnostic_utils_core.py`
  - `02_Simulation_And_Primitive_Learning/grog/agi_telemetry_types.py`
  - `03_Core_AGI_Ecosystem/dna_diagnostic_core.py`
  - `03_Core_AGI_Ecosystem/unitary_core_diagnostics.py`
- **Epistemic Debate & System Scaffold**:
  - `src/app/api/system/scaffold/route.ts`
  - `src/app/api/github/push-enhancements/route.ts`
  - `src/app/api/evolution/debate/route.ts`
  - `src/app/api/brain/types.ts`
- **Components & Visualizers**:
  - `src/components/DalekStatusIndicator.tsx` (Status Indicator)
  - `src/components/DebateChamber.md` (Epistemic Reasoning)
  - `src/components/EvolutionLog.md` (Mutation History)
  - `src/components/SaturationMetrics.tsx` (Model Saturation)
  - `src/components/MutationDiffView.tsx` (Code Mutation Analysis)
  - `src/components/TemporalParadoxLog.tsx` (Paradox Path Extrapolation)

---

## ⚡ Enhancements Incorporated

1. **Gemini 3.6 Flash Engine with Configurable Thinking Levels**:
   - Replaced restricted/deprecated models with `gemini-3.6-flash`.
   - Added user-configurable thinking modes (`High`, `Low`, `Off`) allowing users to prioritize deep step-by-step logic or raw execution speed.

2. **Resilient Auto-Fallback Mechanism**:
   - Implemented automatic error catching for HTTP `429 RESOURCE_EXHAUSTED` / quota limit errors.
   - Automatically fails over to `gemini-flash-latest` without interrupting the user session.

3. **System Telemetry & Real-Time Performance Tracking**:
   - Returns request processing latency (`latencyMs`), active model identification, and telemetry metadata for every message.
   - Includes a toggleable **Telemetry Banner** in the header displaying live server stats, model name, and processing latency.

4. **Epistemic & Reasoning UI Controls**:
   - Added interactive **Prompt Presets** for complex topics:
     - ⚖️ *Epistemic Debate*
     - ⚛️ *Quantum Logic Paradox*
     - 🧬 *Code Mutation & Coherence*
     - 🛠️ *System Scaffold Diagnostic*
   - Included one-click message copying, timestamp tracking, and clear conversation tools.

5. **Diagnostic API Endpoints**:
   - Exposed `/api/health` for uptime checks.
   - Exposed `/api/system/scaffold` reporting active service status, model configuration, and system capabilities.

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Environment Variables**:
   Copy `.env.example` to `.env` and add your key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.
