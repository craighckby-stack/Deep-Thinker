/**
 * TESSERA BOOT TELEMETRY & SANDBOX VERIFIER
 * Architectural Role: Pre-hydration diagnostic probe validating browser capabilities,
 * memory persistence layer prerequisites, and zero-leak memory primitives.
 */

export interface TesseraBootTelemetry {
  bootStartTime: number;
  hasWeakMap: boolean;
  hasFinalizationRegistry: boolean;
  hasSharedArrayBuffer: boolean;
  hasPerformanceObserver: boolean;
  hardwareConcurrency: number;
  deviceMemory: number | null;
  userAgent: string;
}

declare global {
  interface Window {
    __TESSERA_BOOT_TELEMETRY__?: TesseraBootTelemetry;
    __TESSERA_DISMISS_PRELOADER__?: () => void;
  }
}

export function initBootTelemetry(): TesseraBootTelemetry {
  const bootStartTime = performance.now();
  
  const telemetry: TesseraBootTelemetry = {
    bootStartTime,
    hasWeakMap: typeof WeakMap !== 'undefined',
    hasFinalizationRegistry: typeof FinalizationRegistry !== 'undefined',
    hasSharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
    hasPerformanceObserver: typeof PerformanceObserver !== 'undefined',
    hardwareConcurrency: navigator.hardwareConcurrency || 2,
    deviceMemory: (navigator as unknown as { deviceMemory?: number }).deviceMemory || null,
    userAgent: navigator.userAgent,
  };

  window.__TESSERA_BOOT_TELEMETRY__ = telemetry;

  // Preloader graceful dismiss helper
  window.__TESSERA_DISMISS_PRELOADER__ = () => {
    const preloader = document.getElementById('tessera-preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.remove();
      }, 300);
    }
  };

  // Auto-dismiss safety fallback if hydration takes longer than expected
  setTimeout(() => {
    if (window.__TESSERA_DISMISS_PRELOADER__) {
      window.__TESSERA_DISMISS_PRELOADER__();
    }
  }, 4000);

  return telemetry;
}

initBootTelemetry();
