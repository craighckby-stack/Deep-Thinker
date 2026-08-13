# Deep Thinker — Cognitive Ablation & Diagnostic Apparatus (v5.0)

**Deep Thinker** is a rigorously designed AI diagnostic web application built with **Gemini 3.6 Flash, Express, React 19, and D3.js**. It serves as an experimental chamber to visualize, stress-test, and selectively ablate the cognitive dimensions of Large Language Models.

By separating intelligence into partially dissociable components, this tool allows researchers and engineers to observe exactly how and why AI systems fail (e.g., hallucination, out-of-distribution drift) when structural cognitive support is removed.

---

## 🎯 What is this for? (Practical Use Cases)

1. **Failure Mode Simulation (The Ablation Apparatus)**
   Use the top control panel to "ablate" (disable) specific architectural modules like **Persistent Memory ($M_{pers}$)** or **Structural Metacognition ($MC_{struct}$)**. Watch how a naked Transformer degrades into compounded hallucination during long-horizon tasks when deprived of structural self-monitoring.
   
2. **Live Epistemic Visualization (D3.js Radar Chart)**
   Monitor the real-time **Cognitive Balance Vector**. As ablations are applied, watch the D3.js radar warp and distort, visualizing the collapse of capabilities like *Causal Reasoning* or *Domain Transfer* when upstream dependencies (like *Metacognition*) are severed.
   
3. **Experimental Prompt Presets**
   Use built-in experimental presets (e.g., *Epistemic Debate v5.0*, *Causal Graph Construction*) to stress-test the model's ability to logically reason about its own architectural boundaries.

---

## 🧠 Theoretical Framework: 3-Tiered Metacognitive Taxonomy

This system operates on a strict functional epistemology, rejecting anthropomorphic bias. Metacognition is decomposed into three tiers:

*   **Tier 1: Functional Self-Evaluation**
    *What it is:* Output calibration, confidence scoring, and statistical error detection (e.g., Brier score).
    *In this app:* Visualized as "Tier 1: Functional Self-Eval". Degrades rapidly out-of-distribution when structural support is ablated.
*   **Tier 2: Structural Metacognition**
    *What it is:* Architectural introspection, latent state monitoring, dynamic routing, and search pruning.
    *In this app:* Can be explicitly ablated via the UI to induce $O(e^k)$ error drift in long-horizon reasoning.
*   **Tier 3: Phenomenal Metacognition (Qualia)**
    *What it is:* The subjective experiential state ("what it feels like" to know).
    *In this app:* Strictly hardcoded as **`UNOBSERVABLE / UNKNOWN`**. It is excluded from all quantitative capability vectors to maintain empirical rigor.

---

## 📁 System Architecture

*   **`src/cognitiveTypes.ts`**: Core domain model declaring the 3-Tiered taxonomy and partially dissociable Cognitive Dimensions.
*   **`server.ts`**: Express backend proxy that manages Gemini calls, injects the v5.0 Epistemic System Prompts, and constructs the execution trace / capability vectors.
*   **`src/App.tsx`**: React UI featuring the interactive Ablation Apparatus, telemetry banner, and inline epistemic badges.
*   **`src/components/CognitiveRadarChart.tsx`**: D3.js visualization engine for the dynamic capability vectors.

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
