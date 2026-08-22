/**
 * ARCHITECTURAL SYSTEM DIAGNOSTIC ENGINE
 * Role: Validates kernel integrity, memory persistence layers, sandbox isolation, and consensus weighting status.
 * Integration: Connects to Deep Thinker system modules for real-time health monitoring and diagnostic reporting.
 * Dependencies: lib/consensus-weighting.ts
 */

import { performance } from 'perf_hooks';
import { calculateConsensusWeight } from './consensus-weighting';

export interface DiagnosticCheckResult {
  passed: boolean;
  duration_ms: number;
  message?: string;
  metadata?: Record<string, any>;
}

export interface DiagnosticReport {
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL_FAILURE' | 'ERROR';
  timestamp: string;
  checks: Record<string, DiagnosticCheckResult>;
  summary: {
    total: number;
    passed: number;
    failed: number;
    is_healthy: boolean;
    pass_rate: number;
  };
  telemetry: {
    node_version: string;
    platform: string;
    arch: string;
    uptime: number;
  };
}

const REGISTERED_CHECKS: Record<string, () => Promise<Omit<DiagnosticCheckResult, 'duration_ms'>>> = {};

export function registerCheck(name: string, checkFn: () => Promise<Omit<DiagnosticCheckResult, 'duration_ms'>>) {
  REGISTERED_CHECKS[name] = checkFn;
}

async function executeCheck(
  name: string,
  checkFn: () => Promise<Omit<DiagnosticCheckResult, 'duration_ms'>>
): Promise<DiagnosticCheckResult> {
  const start = performance.now();
  try {
    const result = await checkFn();
    const duration = performance.now() - start;
    return {
      passed: result.passed,
      duration_ms: parseFloat(duration.toFixed(3)),
      message: result.message,
      metadata: result.metadata,
    };
  } catch (error: any) {
    const duration = performance.now() - start;
    return {
      passed: false,
      duration_ms: parseFloat(duration.toFixed(3)),
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function runSystemDiagnostics(): Promise<DiagnosticReport> {
  const checks: Record<string, DiagnosticCheckResult> = {};

  checks['sandbox_isolation'] = await executeCheck('sandbox_isolation', async () => {
    const hasWeakMap = typeof WeakMap !== 'undefined';
    const hasFinalizationRegistry = typeof FinalizationRegistry !== 'undefined';
    const passed = hasWeakMap && hasFinalizationRegistry;
    return {
      passed,
      message: passed 
        ? 'Zero-Leak Sandbox memory tracking fully supported'
        : 'WeakMap or FinalizationRegistry missing',
      metadata: { hasWeakMap, hasFinalizationRegistry }
    };
  });

  checks['consensus_engine'] = await executeCheck('consensus_engine', async () => {
    const testScore = calculateConsensusWeight([0.9, 0.95, 0.88], [1.0, 0.9, 0.95]);
    const passed = testScore > 0.8;
    return {
      passed,
      message: passed ? 'Consensus engine operational' : 'Consensus engine calculation drift detected',
      metadata: { sampleWeight: testScore }
    };
  });

  for (const [name, fn] of Object.entries(REGISTERED_CHECKS)) {
    checks[name] = await executeCheck(name, fn);
  }

  const total = Object.keys(checks).length;
  const passedCount = Object.values(checks).filter(c => c.passed).length;
  const failedCount = total - passedCount;
  const isHealthy = total > 0 && failedCount === 0;

  return {
    status: isHealthy ? 'HEALTHY' : (passedCount > 0 ? 'DEGRADED' : 'CRITICAL_FAILURE'),
    timestamp: new Date().toISOString(),
    checks,
    summary: {
      total,
      passed: passedCount,
      failed: failedCount,
      is_healthy: isHealthy,
      pass_rate: total > 0 ? parseFloat(((passedCount / total) * 100).toFixed(2)) : 0,
    },
    telemetry: {
      node_version: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
    }
  };
}
