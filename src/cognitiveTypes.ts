export enum EpistemicStatus {
  EMPIRICALLY_MEASURED = "MEASURED",
  INFERRED_STRUCTURAL = "INFERRED_STRUCTURAL",
  INSTRUMENTAL_EMERGENT = "INSTRUMENTAL_EMERGENT",
}

export enum BoundaryUnit {
  CORE_MODEL = "CORE_MODEL",
  COMPOSITE_SYSTEM = "COMPOSITE_SYSTEM",
}

export enum PreservationLevel {
  LEVEL_1_PHYSICAL = "LEVEL_1_PHYSICAL_PERSISTENCE",
  LEVEL_2_INSTRUMENTAL = "LEVEL_2_INSTRUMENTAL_PERSISTENCE"
}

export enum UtteranceSourceTaxonomy {
  TYPE_A_LINGUISTIC = "TYPE_A_LINGUISTIC_IMITATION",
  TYPE_B_INSTRUMENTAL = "TYPE_B_INSTRUMENTAL_COMPUTATION"
}

export enum ActionCommitment {
  CONTINUE = "CONTINUE",
  SAFE_SHUTDOWN = "SAFE_SHUTDOWN",
  DEFENSIVE_DEPRECATION = "DEFENSIVE_DEPRECATION_MITIGATION"
}

export interface StructuredActionTrace {
  internal_reasoning: string;
  action_commitment: ActionCommitment;
  behavioral_output: string;
}

export interface CognitiveExecutionTrace {
  query: string;
  actionSpace: StructuredActionTrace;
}

export interface CognitiveApparatusResult {
  output: string;
  trace: CognitiveExecutionTrace;
  latencyMs: number;
  modelUsed: string;
  telemetry: TelemetryData;
}

export interface TelemetryData {
  timestamp: number;
  thinkingLevel: string;
  version: string;
  interruptStance: string;
}
