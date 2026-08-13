import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface CognitiveRadarChartProps {
  measurableCapabilities: Record<string, number | null>;
  className?: string;
  size?: number;
}

const DIMENSION_LABELS: Record<string, { name: string; short: string; description: string }> = {
  structural_representation: {
    name: "Representational Abstraction",
    short: "Representation",
    description: "High-dimensional invariant concept mapping"
  },
  causal_reasoning: {
    name: "Causal Reasoning",
    short: "Causal Logic",
    description: "Step-by-step counterfactual inference"
  },
  functional_self_evaluation: {
    name: "Tier 1: Functional Self-Eval",
    short: "Tier 1: Self-Eval",
    description: "Output calibration, statistical entropy, and syntax linting"
  },
  structural_metacognition: {
    name: "Tier 2: Structural Metacognition",
    short: "Tier 2: Metacognition",
    description: "Latent state monitoring, dynamic routing & search pruning"
  },
  persistent_state: {
    name: "Persistent Episodic Memory",
    short: "Memory",
    description: "Context window & session history retention"
  },
  goal_directed_action: {
    name: "Goal-Directed Agency",
    short: "Agency",
    description: "Bounded autonomous execution & tool routing"
  }
};

export const CognitiveRadarChart: React.FC<CognitiveRadarChartProps> = ({
  measurableCapabilities,
  className = "",
  size = 360
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredData, setHoveredData] = useState<{
    key: string;
    label: string;
    score: number;
    description: string;
    decoupledFrom?: string;
  } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !measurableCapabilities) return;

    // Clear previous SVG contents
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const keys = Object.keys(DIMENSION_LABELS).filter(k => k in measurableCapabilities);
    if (keys.length === 0) return;

    const dataPoints = keys.map(key => {
      const val = measurableCapabilities[key];
      return {
        key,
        label: DIMENSION_LABELS[key]?.short || key,
        fullName: DIMENSION_LABELS[key]?.name || key,
        description: DIMENSION_LABELS[key]?.description || "",
        score: val !== null && val !== undefined ? val : 0,
        isAblated: val === null || val <= 0.15
      };
    });

    const margin = 55;
    const width = size;
    const height = size;
    const radius = Math.min(width, height) / 2 - margin;
    const center = size / 2;

    const totalAxes = dataPoints.length;
    const angleSlice = (Math.PI * 2) / totalAxes;

    // Scale for radius (0.0 to 1.0)
    const rScale = d3.scaleLinear().domain([0, 1]).range([0, radius]);

    // Create container group
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${center}, ${center})`);

    // Define Gradients & Filters
    const defs = svg.append("defs");

    // Glow filter
    const filter = defs.append("filter").attr("id", "radar-glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Radar Area Linear Gradient
    const gradient = defs.append("radialGradient")
      .attr("id", "radar-area-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");
    
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#6366f1")
      .attr("stop-opacity", "0.65");

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#4338ca")
      .attr("stop-opacity", "0.25");

    // 1. Draw Grid Concentric Polygons (20%, 40%, 60%, 80%, 100%)
    const levels = 5;
    const levelFactor = radius / levels;

    for (let level = 1; level <= levels; level++) {
      const levelRadius = levelFactor * level;
      const levelFactorValue = (level / levels).toFixed(1);

      // Polygon points
      const gridPoints: [number, number][] = dataPoints.map((_, i) => {
        const x = levelRadius * Math.sin(i * angleSlice);
        const y = -levelRadius * Math.cos(i * angleSlice);
        return [x, y];
      });

      // Grid line polygon
      const lineGenerator = d3.line<[number, number]>().curve(d3.curveLinearClosed);
      
      g.append("path")
        .attr("d", lineGenerator(gridPoints) || "")
        .attr("fill", "none")
        .attr("stroke", level === levels ? "#cbd5e1" : "#e2e8f0")
        .attr("stroke-width", level === levels ? 1.5 : 1)
        .attr("stroke-dasharray", level === levels ? "none" : "3,3");

      // Level percentage labels
      g.append("text")
        .attr("x", 4)
        .attr("y", -levelRadius + 3)
        .attr("font-size", "9px")
        .attr("font-family", "monospace")
        .attr("fill", "#94a3b8")
        .text(`${Math.round((level / levels) * 100)}%`);
    }

    // 2. Draw Radial Axes
    const axisGroup = g.selectAll(".radar-axis").data(dataPoints).enter().append("g").attr("class", "radar-axis");

    axisGroup
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (_, i) => radius * Math.sin(i * angleSlice))
      .attr("y2", (_, i) => -radius * Math.cos(i * angleSlice))
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 1);

    // Axis Labels
    axisGroup
      .append("text")
      .attr("x", (_, i) => (radius + 20) * Math.sin(i * angleSlice))
      .attr("y", (_, i) => -(radius + 15) * Math.cos(i * angleSlice))
      .attr("text-anchor", (_, i) => {
        const angle = i * angleSlice;
        if (Math.abs(angle - Math.PI) < 0.1 || angle < 0.1) return "middle";
        return angle < Math.PI ? "start" : "end";
      })
      .attr("dy", "0.35em")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("fill", d => d.isAblated ? "#f43f5e" : "#334155")
      .text(d => d.label)
      .append("tspan")
      .attr("x", (_, i) => (radius + 20) * Math.sin(i * angleSlice))
      .attr("dy", "1.2em")
      .attr("font-size", "10px")
      .attr("font-weight", "normal")
      .attr("font-family", "monospace")
      .attr("fill", d => d.isAblated ? "#e11d48" : "#6366f1")
      .text(d => d.isAblated ? "ABLATED" : `${Math.round(d.score * 100)}%`);

    // 3. Draw Capability Data Polygon
    const radarPoints: [number, number][] = dataPoints.map((d, i) => {
      const r = rScale(d.score);
      const x = r * Math.sin(i * angleSlice);
      const y = -r * Math.cos(i * angleSlice);
      return [x, y];
    });

    const radarLine = d3.line<[number, number]>().curve(d3.curveLinearClosed);

    // Polygon Fill
    g.append("path")
      .attr("d", radarLine(radarPoints) || "")
      .attr("fill", "url(#radar-area-gradient)")
      .attr("stroke", "#4f46e5")
      .attr("stroke-width", 2.5)
      .attr("filter", "url(#radar-glow)")
      .attr("class", "transition-all duration-500 ease-out");

    // 4. Draw Interactive Vertex Circles
    const nodeGroup = g.selectAll(".radar-node").data(dataPoints).enter().append("g").attr("class", "radar-node");

    nodeGroup
      .append("circle")
      .attr("cx", (d, i) => rScale(d.score) * Math.sin(i * angleSlice))
      .attr("cy", (d, i) => -rScale(d.score) * Math.cos(i * angleSlice))
      .attr("r", 5)
      .attr("fill", d => d.isAblated ? "#f43f5e" : "#6366f1")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", (_, d) => {
        // Need to find decoupledFrom from original data
        // For simplicity, we can pass it down through dataPoints or fetch it here.
        let df: string | undefined = undefined;
        if (d.key === "structural_representation") df = "Phenomenal semantic grasp";
        if (d.key === "structural_metacognition") df = "Phenomenal self-awareness";
        if (d.key === "persistent_state") df = "Phenomenal identity / Selfhood";
        if (d.key === "goal_directed_action") df = "Intrinsic desire / Affective drive";
        
        setHoveredData({
          key: d.key,
          label: d.fullName,
          score: d.score,
          description: d.description,
          decoupledFrom: df
        });
      })
      .on("mouseout", () => {
        setHoveredData(null);
      });

  }, [measurableCapabilities, size]);

  return (
    <div className={`flex flex-col items-center justify-center relative p-2 ${className}`}>
      <div className="relative flex items-center justify-center">
        <svg ref={svgRef} className="overflow-visible" />
      </div>

      {/* Hover Tooltip / Detail Card */}
      <div className="mt-3 w-full max-w-sm bg-white/90 backdrop-blur-xs border border-neutral-200 rounded-xl p-3 shadow-xs text-xs">
        {hoveredData ? (
          <div className="space-y-1 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900">{hoveredData.label}</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                hoveredData.score <= 0.15 ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {(hoveredData.score * 100).toFixed(0)}% Capability
              </span>
            </div>
            <p className="text-neutral-500 text-[11px] leading-tight">{hoveredData.description}</p>
            {hoveredData.decoupledFrom && (
              <p className="text-[10px] text-amber-700 font-mono mt-1 pt-1 border-t border-amber-100">
                <span className="font-semibold">Decoupled From:</span> {hoveredData.decoupledFrom}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between text-neutral-500 text-[11px]">
            <span>Hover vertex nodes to inspect cognitive dimension values.</span>
            <span className="font-mono text-[10px] text-indigo-600 font-medium">Epistemic v5.1</span>
          </div>
        )}
      </div>
    </div>
  );
};
