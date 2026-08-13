export enum EpistemicStatus {
  UNOBSERVABLE = "UNOBSERVABLE / UNKNOWN",
  EMPIRICALLY_MEASURED = "MEASURED",
  INFERRED_STRUCTURAL = "INFERRED_STRUCTURAL",
  INSTRUMENTAL_EMERGENT = "INSTRUMENTAL_EMERGENT",
}

export enum BoundaryUnit {
  CORE_MODEL = "CORE_MODEL",
  COMPOSITE_SYSTEM = "COMPOSITE_SYSTEM",
}

export enum CognitiveDimension {
  REPRESENTATION = "structural_representation",
  CAUSAL_REASONING = "causal_reasoning",
  FUNCTIONAL_SELF_EVAL = "functional_self_evaluation",
  STRUCTURAL_METACOGNITION = "structural_metacognition",
  EPISODIC_MEMORY = "persistent_state",
  AGENCY = "goal_directed_action",
}

export interface CapabilityMetric {
  score: number | null; // 0.0 to 1.0 for measurable traits
  status: EpistemicStatus;
  boundaryUnit?: BoundaryUnit;
  decoupledFrom?: string;
  notes?: string;
}

export interface CognitiveCapabilityProfile {
  dimensions: Record<CognitiveDimension, CapabilityMetric>;
  phenomenologyStatus: EpistemicStatus;
}

export interface CognitiveExecutionTrace {
  query: string;
  latentMap: {
    domain?: string;
    concepts?: string[];
  };
  reasoningSteps: string[];
  confidenceEstimate: number;
  functionalFlags: string[];
}

export interface CognitiveApparatusResult {
  output: string;
  trace: CognitiveExecutionTrace;
  epistemicProfile: {
    measurableCapabilities: Record<string, number | null>;
    phenomenalStatus: string;
  };
  latencyMs: number;
  modelUsed: string;
}

export function getDefaultCapabilityProfile(ablations?: {
  disableMemory?: boolean;
  disableMetacognition?: boolean;
  disableAgency?: boolean;
}): CognitiveCapabilityProfile {
  return {
    dimensions: {
      [CognitiveDimension.REPRESENTATION]: {
        score: 0.88,
        status: EpistemicStatus.EMPIRICALLY_MEASURED,
        boundaryUnit: BoundaryUnit.CORE_MODEL,
        decoupledFrom: "Phenomenal semantic grasp",
        notes: "High-dimensional latent mapping across domains",
      },
      [CognitiveDimension.CAUSAL_REASONING]: {
        score: 0.82,
        status: EpistemicStatus.EMPIRICALLY_MEASURED,
        boundaryUnit: BoundaryUnit.COMPOSITE_SYSTEM,
        notes: "Counterfactual step-by-step logic",
      },
      [CognitiveDimension.FUNCTIONAL_SELF_EVAL]: {
        score: 0.78,
        status: EpistemicStatus.EMPIRICALLY_MEASURED,
        boundaryUnit: BoundaryUnit.CORE_MODEL,
        notes: "Tier 1: Output calibration and statistical syntax linting",
      },
      [CognitiveDimension.STRUCTURAL_METACOGNITION]: {
        score: ablations?.disableMetacognition ? 0.10 : 0.65,
        status: EpistemicStatus.INFERRED_STRUCTURAL,
        boundaryUnit: BoundaryUnit.COMPOSITE_SYSTEM,
        decoupledFrom: "Phenomenal self-awareness",
        notes: ablations?.disableMetacognition
          ? "Ablated: minimal self-model limits inspection (OOD drift likely)"
          : "Tier 2: Active dynamic modeling of latent state and uncertainty",
      },
      [CognitiveDimension.EPISODIC_MEMORY]: {
        score: ablations?.disableMemory ? 0.00 : 0.50,
        status: EpistemicStatus.EMPIRICALLY_MEASURED,
        boundaryUnit: BoundaryUnit.COMPOSITE_SYSTEM,
        decoupledFrom: "Phenomenal identity / Selfhood",
        notes: ablations?.disableMemory
          ? "Ablated: stateless execution"
          : "Context window & session history persistence",
      },
      [CognitiveDimension.AGENCY]: {
        score: ablations?.disableAgency ? 0.10 : 0.40,
        status: EpistemicStatus.INSTRUMENTAL_EMERGENT,
        boundaryUnit: BoundaryUnit.COMPOSITE_SYSTEM,
        decoupledFrom: "Intrinsic desire / Affective drive",
        notes: ablations?.disableAgency
          ? "Ablated: purely reactive"
          : "Bounded execution & tool router",
      },
    },
    phenomenologyStatus: EpistemicStatus.UNOBSERVABLE,
  };
}
