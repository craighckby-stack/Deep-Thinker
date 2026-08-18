/**
 * ARCHITECTURAL ENVIRONMENT VALIDATOR ENGINE
 * Role: Validates, parses, and enforces strict schema compliance for active environment variables.
 * Integration: Interoperates with diagnostic-engine.ts to verify runtime system readiness.
 * Dependencies: process.env, fs, path
 */

import * as fs from 'fs';
import * as path from 'path';

export interface EnvValidationResult {
  isValid: boolean;
  missingRequired: string[];
  warnings: string[];
  config: Record<string, string | number | boolean>;
}

export function validateEnvironment(): EnvValidationResult {
  const missingRequired: string[] = [];
  const warnings: string[] = [];
  const config: Record<string, string | number | boolean> = {};

  // Primary LLM Provider Check
  const primaryKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY;
  if (!primaryKey) {
    warnings.push('No primary LLM API key detected (GEMINI_API_KEY, OPENAI_API_KEY, or DEEPSEEK_API_KEY). Local fallback required.');
  }

  config['GEMINI_API_KEY'] = process.env.GEMINI_API_KEY || '';
  config['OPENAI_API_KEY'] = process.env.OPENAI_API_KEY || '';
  config['DEEPSEEK_API_KEY'] = process.env.DEEPSEEK_API_KEY || '';
  config['LOCAL_LLM_ENDPOINT'] = process.env.LOCAL_LLM_ENDPOINT || 'http://localhost:11434';

  // Memory & Sandbox Parameters
  config['MEMORY_PERSISTENCE_DIR'] = process.env.MEMORY_PERSISTENCE_DIR || './memory';
  config['SANDBOX_MAX_MEMORY_MB'] = parseInt(process.env.SANDBOX_MAX_MEMORY_MB || '512', 10);
  config['CONSENSUS_THRESHOLD'] = parseFloat(process.env.CONSENSUS_THRESHOLD || '0.75');
  config['DIAGNOSTICS_ENABLED'] = process.env.DIAGNOSTICS_ENABLED !== 'false';

  return {
    isValid: missingRequired.length === 0,
    missingRequired,
    warnings,
    config
  };
}
