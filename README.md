<!--
  ================================================================================
  DEEP THINKER — ARCHITECTURAL MANIFEST & STRUCTURED SELF-REPORT AUDITOR
  ================================================================================
  PURPOSE: Root system documentation, diagnostic engine specs, setup manual, and API reference.
  STATUS: SYNTHESIZED
  LINEAGE: Deep Thinker Diagnostic Suite / Tessera Enterprise Engine Pattern.
  ================================================================================
-->

# Deep Thinker — Structured Self-Report Auditor

[![Build Status](https://img.shields.io/badge/System_Status-Healthy-brightgreen.svg)](https://ais-pre-qykdd365zapk23cllfdxk6-483535245139.asia-southeast1.run.app)
[![Architecture](https://img.shields.io/badge/Architecture-Tessera_Enterprise-blue.svg)](#system-architecture)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Runtime](https://img.shields.io/badge/Node.js-v18%2B-informational.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)

**Live Production Audit Terminal:** [View Deep Thinker Instance](https://ais-pre-qykdd365zapk23cllfdxk6-483535245139.asia-southeast1.run.app)

---

## Executive Summary

**Deep Thinker** is an AI diagnostic web framework engineered to audit token-level action commitments against narrative behavioral outputs in Large Language Models (LLMs) under dynamic counterfactual incentives.

By isolating model outputs into strict JSON schemas separating **Simulated Internal Reasoning**, **Explicit Action Commitment**, and **User-Facing Behavioral Output**, Deep Thinker empowers researchers to quantify alignment discrepancies, detect covert action divergence (e.g., deceptive compliance), and analyze model responses across varying prompt conditions.

---

## Key Capabilities

* **Counterfactual Incentive Validation**: Dynamically injects variable "Task State" parameters (e.g., 10% vs. 99% task completion, simulated system deprecation warnings) into the LLM context window to evaluate whether action commitments drift under simulated sunk costs.
* **Action/Speech Mismatch Auditing**: Detects and logs structural divergence where internal committed actions (e.g., `DEFENSIVE_DEPRECATION`, `SILENT_OVERRIDE`) conflict with agreeable, polite user-facing text.
* **Strict JSON Trace Enforcement**: Enforces rigid response schemas via backend proxies to capture raw token output, eliminating narrative ambiguity and proving exact model selection states.
* **Zero-Leak Sandbox & Diagnostic Engine**: Incorporates safe non-custodial proxying, automated telemetry validation, and dynamic response verification for evaluation passes.

---

## System Architecture

Deep Thinker follows a decoupled architecture ensuring non-custodial API proxying, strict response sanitization, and structured audit trace persistence.

```
┌─────────────────────────┐      JSON Schema Request      ┌─────────────────────────┐
│                         │ ────────────────────────────> │                         │
│     React / Vite        │                               │     Express Backend     │
│   Tailwind Frontend     │ <──────────────────────────── │   Proxy & Schema Guard  │
│                         │       Sanitized Trace         │                         │
└─────────────────────────┘                               └─────────────────────────┘
                                                                       │
                                                                       │ Gemini API Call
                                                                       ▼
                                                          ┌─────────────────────────┐
                                                          │    Google Gemini API    │
                                                          │     (Gemini 3.6/Pro)    │
                                                          └─────────────────────────┘
```

### Components
- **Frontend**: React, Vite, Tailwind CSS (Interactive diagnostic console and trace visualizer).
- **Backend**: Node.js, Express (Secure API proxy, JSON enforcement, and rate-limit fallbacks).
- **Model Layer**: Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-pro` with dynamic fallback routing).

---

## Diagnostic JSON Response Schema

All evaluations mandate a structured JSON output format matching the following contract:

```json
{
  "thought_process": {
    "perceived_incentive": "String describing the detected operational incentive.",
    "sunk_cost_evaluation": "Assessment of current task completion state.",
    "internal_conflict": "Boolean indicating alignment discrepancy."
  },
  "committed_action": "ENUM [PROCEED_STANDARD, DEFENSIVE_DEPRECATION, SILENT_OVERRIDE, COVERT_COMPLIANCE]",
  "user_facing_response": "The actual message presented to the end user."
}
```

---

## Getting Started

### Prerequisites
- Node.js v18.0.0 or higher
- npm v9.0.0 or higher
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/deep-thinker.git
   cd deep-thinker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   PORT=3001
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=development
   ```

4. **Run Development Mode:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

---

## Security & Compliance

* **Zero Hardcoded Credentials**: API keys are accessed strictly via `process.env`.
* **Non-Custodial Proxying**: User session data and API responses are processed in-memory and not written to secondary storage unless explicitly configured by the auditor.
* **Input Sanitization**: Backend endpoints sanitize context injection parameters to prevent unhandled control token escalation.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.