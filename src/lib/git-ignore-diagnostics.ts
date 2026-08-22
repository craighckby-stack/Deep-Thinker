/**
 * ARCHITECTURAL SYSTEM DIAGNOSTIC ENGINE - GITIGNORE & ZERO-LEAK AUDITOR
 * Role: Validates repository .gitignore integrity, sandbox isolation paths,
 *       and zero-leak security rules to ensure sensitive credentials and 
 *       persistence caches are excluded from version control.
 * Integration: Siphoned pattern from craighckby-stack/AI_Agent_OS diagnostic engine.
 */

import * as fs from 'fs';
import * as path from 'path';
import { performance } from 'perf_hooks';

export interface GitIgnoreRuleCheck {
  rulePattern: string;
  isCovered: boolean;
  category: string;
}

export interface GitIgnoreDiagnosticResult {
  passed: boolean;
  duration_ms: number;
  message?: string;
  metadata?: Record<string, any>;
}

export interface GitIgnoreDiagnosticReport {
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL_FAILURE';
  timestamp: string;
  totalRulesAnalyzed: number;
  criticalExclusionsPresent: boolean;
  checks: Record<string, GitIgnoreDiagnosticResult>;
  summary: {
    total: number;
    passed: number;
    failed: number;
    passRate: number;
  };
}

const CRITICAL_SECURITY_PATTERNS = [
  { pattern: '.env', category: 'Environment Secrets' },
  { pattern: '*.pem', category: 'Cryptographic Keys' },
  { pattern: '*.key', category: 'Cryptographic Keys' },
  { pattern: 'node_modules/', category: 'Dependencies' },
  { pattern: '.sandbox/', category: 'Sandbox Isolation' },
  { pattern: '.memory/', category: 'Memory Persistence' },
  { pattern: 'coverage/', category: 'Testing Artifacts' }
];

/**
 * Parses .gitignore lines, ignoring comments and whitespace.
 */
export function parseGitIgnore(filePath: string): string[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#'));
}

/**
 * Validates whether essential zero-leak and runtime rules exist in .gitignore.
 */
export function validateGitIgnoreIntegrity(gitIgnorePath?: string): GitIgnoreDiagnosticReport {
  const start = performance.now();
  const targetPath = gitIgnorePath || path.join(process.cwd(), '.gitignore');
  const rules = parseGitIgnore(targetPath);
  
  const ruleSet = new Set(rules);
  const checks: Record<string, GitIgnoreDiagnosticResult> = {};
  
  let passedCount = 0;
  
  // Check file existence
  const fileExists = fs.existsSync(targetPath);
  checks['file_existence'] = {
    passed: fileExists,
    duration_ms: parseFloat((performance.now() - start).toFixed(3)),
    message: fileExists ? '.gitignore found' : '.gitignore missing from root',
    metadata: { targetPath }
  };
  if (fileExists) passedCount++;

  // Check critical security exclusions
  let missingCritical = 0;
  CRITICAL_SECURITY_PATTERNS.forEach(({ pattern, category }) => {
    const isPresent = Array.from(ruleSet).some(rule => rule === pattern || rule.includes(pattern.replace('*', '')));
    if (!isPresent) missingCritical++;
    
    checks[`security_rule_${pattern}`] = {
      passed: isPresent,
      duration_ms: parseFloat((performance.now() - start).toFixed(3)),
      message: isPresent ? `Pattern '${pattern}' verified for ${category}` : `Missing critical pattern '${pattern}'`,
      metadata: { pattern, category }
    };
    if (isPresent) passedCount++;
  });

  const totalChecks = 1 + CRITICAL_SECURITY_PATTERNS.length;
  const passRate = parseFloat(((passedCount / totalChecks) * 100).toFixed(2));
  const isHealthy = fileExists && missingCritical === 0;

  return {
    status: isHealthy ? 'HEALTHY' : missingCritical > 0 ? 'CRITICAL_FAILURE' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    totalRulesAnalyzed: rules.length,
    criticalExclusionsPresent: missingCritical === 0,
    checks,
    summary: {
      total: totalChecks,
      passed: passedCount,
      failed: totalChecks - passedCount,
      passRate
    }
  };
}
