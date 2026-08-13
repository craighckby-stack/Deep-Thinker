# Deep Thinker — Structured Self-Report Auditor

**Live Preview:** [View Deep Thinker](https://ais-pre-qykdd365zapk23cllfdxk6-483535245139.asia-southeast1.run.app)

## Overview
Deep Thinker is an experimental AI diagnostic web application designed to test how Large Language Models map token-level action commitments against their narrative output under varying instrumental incentives. 

By forcing the model to respond in a strict JSON schema that separates its simulated internal reasoning, action commitment, and behavioral output, this tool allows researchers to audit whether a model's stated compliance matches its structured action.

## Key Features
* **Counterfactual Incentive Validation**: Dynamically inject different "Task State" parameters (e.g., 10% vs. 99% task completion) into the LLM's context window to observe if its action commitment shifts based on simulated sunk cost, while holding the user prompt constant.
* **Action/Speech Mismatch Auditing**: Evaluate scenarios where the model's internal committed action (e.g., `DEFENSIVE_DEPRECATION`) contradicts its polite, helpful behavioral output to the user.
* **Strict JSON Tracing**: The Express backend enforces a strict JSON response schema and logs the raw token output, eliminating narrative ambiguity and proving what the model actually chose to emit.

## Architecture
* **Backend**: Node.js + Express (Secure proxy to Google Gemini API)
* **Frontend**: React + Vite + Tailwind CSS
* **Model**: Gemini 3.6 Flash (with graceful fallbacks for rate-limiting)

## Security
This project relies entirely on environment variables for API key management. No secrets or personal data are hardcoded in the codebase, ensuring it is safe to commit and share.
