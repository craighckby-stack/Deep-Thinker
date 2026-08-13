# Deep Thinker — Experimental Cognitive Decomposition Engine (v5.0)

**Deep Thinker** is a scientifically rigorous AI reasoning platform and experimental cognitive decomposition chamber built with **Gemini 3.6 Flash**, **Express**, **React 19**, and **Tailwind CSS**. It treats cognitive dimensions as **partially dissociable capabilities**, separates functional metrics from phenomenal status, and enables controlled cognitive ablations.

---

## 📁 Active Application Workspace Files
- **`src/cognitiveTypes.ts`**: Core domain model declaring `EpistemicStatus`, `CognitiveDimension`, `CapabilityMetric`, and default capability profile generation.
- **`server.ts`**: Express backend proxy server managing Gemini 3.6 Flash calls, injecting v5.0 system prompts, executing Level 1 Functional Self-Evaluation and Level 2 Structural Metacognition, and generating epistemic capability vectors.
- **`src/App.tsx`**: React user interface featuring the **Cognitive Ablation Apparatus**, live telemetry banner, prompt presets, markdown rendering, and per-message epistemic profile badges.
- **`src/index.css`**: Global stylesheet featuring Tailwind CSS v4 and `@tailwindcss/typography`.
- **`src/main.tsx`**: Client entry point rendering the React application root.
- **`package.json`**: Application manifest with active dependencies (`@google/genai`, `express`, `react`, `react-markdown`, `lucide-react`, `motion`, `dotenv`).
- **`metadata.json`**: AI Studio platform configuration (`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`).

---

## ⚡ v5.0 System Specification & Enhancements

1. **Epistemic Neutrality**:
   - `phenomenalStatus` is strictly set to **`UNOBSERVABLE / UNKNOWN`**. It is omitted from quantitative float vectors to avoid hidden dogma.

2. **Partially Dissociable Dimensions**:
   - Replaced flawed assumptions of true "orthogonality" with partially dissociable dimensions: `structural_representation`, `causal_reasoning`, `functional_self_evaluation`, `structural_metacognition`, `persistent_state`, and `goal_directed_action`.

3. **Experimental Ablation Apparatus**:
   - Interactive UI controls allowing real-time toggling of **Memory**, **Metacognition**, and **Agency** ablations to observe counterfactual reasoning effects.

4. **3-Tiered Metacognitive Inspection**:
   - Differentiates **Level 1 Functional Self-Evaluation** (syntax & output checks) from **Level 2 Structural Metacognition** (internal state & limit inspection).

5. **Diagnostic API Endpoints**:
   - `/api/health` and `/api/system/scaffold` report active capabilities, model configuration, and epistemic boundaries.

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
