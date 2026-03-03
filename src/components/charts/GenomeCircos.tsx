"use client";

import { arc, max, scaleLinear } from "d3";
import type { ReactElement } from "react";
import { useMemo, useState } from "react";

import type { GenomeBand, GenomeBin, GenomeChromosome, GenomeCircosData } from "@/types/genome";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Props = Readonly<{
  data: GenomeCircosData;
}>;

type TooltipData = Readonly<{
  x: number;
  y: number;
  chromosome: string;
  bandName: string | null;
  snpCount: number | null;
  hetRate: number | null;
  position: string | null;
}>;

type ChromArc = Readonly<{
  chrom: GenomeChromosome;
  startAngle: number;
  endAngle: number;
}>;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WIDTH = 1200;
const HEIGHT = 560;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;

const CHROM_GAP_DEG = 1.8;
const TOTAL_GAP_DEG = CHROM_GAP_DEG * 23;
const AVAILABLE_DEG = 360 - TOTAL_GAP_DEG;

const R_OUTER = 240;
const R_CHROM_INNER = 220;
const R_DENSITY_OUTER = 214;
const R_DENSITY_INNER = 170;
const R_HET_OUTER = 162;
const R_HET_INNER = 138;

const DEG_TO_RAD = Math.PI / 180;

const STAIN_COLORS: Record<string, string> = {
  gneg: "#f5f5f5",
  gpos25: "#d0d0d0",
  gpos50: "#a0a0a0",
  gpos75: "#707070",
  gpos100: "#404040",
  acen: "#c44e52",
  gvar: "#b8b8b8",
  stalk: "#e0e0e0",
};

const CHROM_COLORS = [
  "#5b7aa5", "#8cb369", "#d4a05a", "#c2697a",
  "#7ba3c9", "#a5c882", "#e6b76e", "#d98ea0",
  "#6d94b8", "#97bd76", "#dba964", "#cd788b",
  "#85aed4", "#b0d08f", "#efc37d", "#e4a0b2",
  "#5f8cb0", "#91c570", "#d9a85e", "#c87388",
  "#7facc7", "#a9cd80", "#e3b872",
] as const;

const tooltipStyles = {
  container: {
    position: "fixed" as const,
    pointerEvents: "none" as const,
    background: "#fff",
    border: "1px solid #232323",
    padding: "8px 12px",
    fontSize: "12px",
    color: "#000",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
    zIndex: 100,
    transform: "translate(-50%, calc(-100% - 12px))",
  },
  label: {
    color: "#898989",
    fontSize: "11px",
  },
  value: {
    fontWeight: 600,
  },
} as const;

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

const degToRad = (deg: number): number => deg * DEG_TO_RAD;

const computeChromArcs = (chromosomes: ReadonlyArray<GenomeChromosome>): ReadonlyArray<ChromArc> => {
  const totalBp = chromosomes.reduce((sum, c) => sum + c.size, 0);
  const arcs: Array<ChromArc> = [];
  let currentDeg = 0;

  for (const chrom of chromosomes) {
    const spanDeg = (chrom.size / totalBp) * AVAILABLE_DEG;
    arcs.push({
      chrom,
      startAngle: degToRad(currentDeg),
      endAngle: degToRad(currentDeg + spanDeg),
    });
    currentDeg += spanDeg + CHROM_GAP_DEG;
  }

  return arcs;
};

const positionToAngle = (position: number, chromSize: number, startAngle: number, endAngle: number): number => {
  const fraction = position / chromSize;
  return startAngle + fraction * (endAngle - startAngle);
};

// ---------------------------------------------------------------------------
// Sub-components rendered as SVG
// ---------------------------------------------------------------------------

const ChromosomeRing = (props: {
  chromArcs: ReadonlyArray<ChromArc>;
  onHover: (data: TooltipData | null) => void;
}): ReactElement => {
  const { chromArcs, onHover } = props;
  const chromArcGen = arc<{ startAngle: number; endAngle: number }>()
    .innerRadius(R_CHROM_INNER)
    .outerRadius(R_OUTER)
    .cornerRadius(2);

  return (
    <g>
      {chromArcs.map((ca, ci) => {
        const bandArcGen = arc<{ startAngle: number; endAngle: number }>()
          .innerRadius(R_CHROM_INNER)
          .outerRadius(R_OUTER);

        return (
          <g key={ca.chrom.id}>
            {/* chromosome background */}
            <path
              d={chromArcGen({ startAngle: ca.startAngle, endAngle: ca.endAngle }) ?? ""}
              fill={CHROM_COLORS[ci % CHROM_COLORS.length]}
              opacity={0.15}
              stroke="none"
            />

            {/* cytoband fills */}
            {ca.chrom.bands.map((band: GenomeBand) => {
              const bStart = positionToAngle(band.s, ca.chrom.size, ca.startAngle, ca.endAngle);
              const bEnd = positionToAngle(band.e, ca.chrom.size, ca.startAngle, ca.endAngle);

              return (
                <path
                  key={`${ca.chrom.id}-${band.name}`}
                  d={bandArcGen({ startAngle: bStart, endAngle: bEnd }) ?? ""}
                  fill={STAIN_COLORS[band.stain] ?? "#e0e0e0"}
                  stroke="rgba(0,0,0,0.08)"
                  strokeWidth={0.3}
                  onMouseMove={(e) => {
                    onHover({
                      x: e.clientX,
                      y: e.clientY,
                      chromosome: `Chr ${ca.chrom.label}`,
                      bandName: `${band.name} (${band.stain})`,
                      snpCount: null,
                      hetRate: null,
                      position: `${(band.s / 1e6).toFixed(1)}-${(band.e / 1e6).toFixed(1)} Mb`,
                    });
                  }}
                  onMouseLeave={() => onHover(null)}
                />
              );
            })}

            {/* chromosome border arcs */}
            <path
              d={chromArcGen({ startAngle: ca.startAngle, endAngle: ca.endAngle }) ?? ""}
              fill="none"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth={0.5}
            />

            {/* chromosome label */}
            {(() => {
              const midAngle = (ca.startAngle + ca.endAngle) / 2;
              const labelR = R_OUTER + 16;
              const lx = Math.cos(midAngle - Math.PI / 2) * labelR;
              const ly = Math.sin(midAngle - Math.PI / 2) * labelR;
              const rotation = (midAngle * 180) / Math.PI - 90;
              const flip = rotation > 90 && rotation < 270;

              return (
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#898989"
                  fontSize={ca.chrom.label.length > 1 ? 9 : 10}
                  fontWeight={500}
                  transform={`rotate(${flip ? rotation + 180 : rotation}, ${lx}, ${ly})`}
                >
                  {ca.chrom.label}
                </text>
              );
            })()}
          </g>
        );
      })}
    </g>
  );
};

const DensityTrack = (props: {
  chromArcs: ReadonlyArray<ChromArc>;
  maxDensity: number;
  windowSize: number;
  onHover: (data: TooltipData | null) => void;
}): ReactElement => {
  const { chromArcs, maxDensity, windowSize, onHover } = props;
  const radiusScale = scaleLinear().domain([0, maxDensity]).range([0, R_DENSITY_OUTER - R_DENSITY_INNER]);

  return (
    <g>
      {chromArcs.map((ca, ci) => (
        <g key={`density-${ca.chrom.id}`}>
          {ca.chrom.bins.map((bin: GenomeBin) => {
            const bpStart = bin.i * windowSize;
            const bpEnd = Math.min(bpStart + windowSize, ca.chrom.size);
            const aStart = positionToAngle(bpStart, ca.chrom.size, ca.startAngle, ca.endAngle);
            const aEnd = positionToAngle(bpEnd, ca.chrom.size, ca.startAngle, ca.endAngle);
            const barHeight = radiusScale(bin.n);
            const binArc = arc<{ startAngle: number; endAngle: number }>()
              .innerRadius(R_DENSITY_INNER)
              .outerRadius(R_DENSITY_INNER + barHeight);

            return (
              <path
                key={`d-${ca.chrom.id}-${bin.i}`}
                d={binArc({ startAngle: aStart, endAngle: aEnd }) ?? ""}
                fill={CHROM_COLORS[ci % CHROM_COLORS.length]}
                opacity={0.7}
                onMouseMove={(e) => {
                  onHover({
                    x: e.clientX,
                    y: e.clientY,
                    chromosome: `Chr ${ca.chrom.label}`,
                    bandName: null,
                    snpCount: bin.n,
                    hetRate: bin.n > 0 ? bin.het / bin.n : 0,
                    position: `${(bpStart / 1e6).toFixed(0)}-${(bpEnd / 1e6).toFixed(0)} Mb`,
                  });
                }}
                onMouseLeave={() => onHover(null)}
              />
            );
          })}
        </g>
      ))}
    </g>
  );
};

const HeterozygosityTrack = (props: {
  chromArcs: ReadonlyArray<ChromArc>;
  windowSize: number;
  onHover: (data: TooltipData | null) => void;
}): ReactElement => {
  const { chromArcs, windowSize, onHover } = props;
  const hetColorScale = scaleLinear<string>()
    .domain([0, 0.10, 0.20, 0.35])
    .range(["#2c3e50", "#3498db", "#f1c40f", "#e74c3c"])
    .clamp(true);

  const hetArcGen = arc<{ startAngle: number; endAngle: number }>()
    .innerRadius(R_HET_INNER)
    .outerRadius(R_HET_OUTER);

  return (
    <g>
      {chromArcs.map((ca) => (
        <g key={`het-${ca.chrom.id}`}>
          {ca.chrom.bins.map((bin: GenomeBin) => {
            if (bin.n === 0) return null;
            const bpStart = bin.i * windowSize;
            const bpEnd = Math.min(bpStart + windowSize, ca.chrom.size);
            const aStart = positionToAngle(bpStart, ca.chrom.size, ca.startAngle, ca.endAngle);
            const aEnd = positionToAngle(bpEnd, ca.chrom.size, ca.startAngle, ca.endAngle);
            const hetRate = bin.het / bin.n;

            return (
              <path
                key={`h-${ca.chrom.id}-${bin.i}`}
                d={hetArcGen({ startAngle: aStart, endAngle: aEnd }) ?? ""}
                fill={hetColorScale(hetRate)}
                opacity={0.85}
                onMouseMove={(e) => {
                  onHover({
                    x: e.clientX,
                    y: e.clientY,
                    chromosome: `Chr ${ca.chrom.label}`,
                    bandName: null,
                    snpCount: bin.n,
                    hetRate,
                    position: `${(bpStart / 1e6).toFixed(0)}-${(bpEnd / 1e6).toFixed(0)} Mb`,
                  });
                }}
                onMouseLeave={() => onHover(null)}
              />
            );
          })}
        </g>
      ))}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Legend
// ---------------------------------------------------------------------------

const LEGEND_X = CX + R_OUTER + 60;
const LEGEND_Y = CY - 40;

const Legend = (): ReactElement => {
  const hetStops = [
    { rate: "0%", color: "#2c3e50" },
    { rate: "10%", color: "#3498db" },
    { rate: "20%", color: "#f1c40f" },
    { rate: "35%", color: "#e74c3c" },
  ];

  return (
    <g transform={`translate(${LEGEND_X}, ${LEGEND_Y})`}>
      <text x={0} y={0} fill="#898989" fontSize={10}>
        SNP Density
      </text>
      <text x={0} y={14} fill="#898989" fontSize={9}>
        (outer ring)
      </text>

      <text x={0} y={38} fill="#898989" fontSize={10}>
        Heterozygosity
      </text>
      <text x={0} y={52} fill="#898989" fontSize={9}>
        (inner ring)
      </text>

      {hetStops.map((stop, i) => (
        <g key={`het-legend-${i}`}>
          <rect x={i * 20} y={62} width={20} height={8} fill={stop.color} opacity={0.85} />
          <text x={i * 20 + 10} y={80} textAnchor="middle" fill="#898989" fontSize={8}>
            {stop.rate}
          </text>
        </g>
      ))}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

const CenterStats = (props: { data: GenomeCircosData }): ReactElement => {
  const { data } = props;
  const hetPct = ((data.totalHet / data.totalSnps) * 100).toFixed(1);

  return (
    <g transform={`translate(${CX}, ${CY})`}>
      <text x={0} y={-16} textAnchor="middle" fill="#232323" fontSize={14} fontWeight={600}>
        {data.totalSnps.toLocaleString()}
      </text>
      <text x={0} y={-2} textAnchor="middle" fill="#898989" fontSize={9}>
        SNPs genotyped
      </text>

      <text x={0} y={20} textAnchor="middle" fill="#232323" fontSize={13} fontWeight={600}>
        {hetPct}%
      </text>
      <text x={0} y={33} textAnchor="middle" fill="#898989" fontSize={9}>
        heterozygosity
      </text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const GenomeCircos = (props: Props): ReactElement => {
  const { data } = props;
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const chromArcs = useMemo(() => computeChromArcs(data.chromosomes), [data.chromosomes]);

  const maxDensity = useMemo(() => {
    const allCounts = data.chromosomes.flatMap((c) => c.bins.map((b) => b.n));
    return max(allCounts) ?? 1;
  }, [data.chromosomes]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Genome Circos plot showing SNP density and heterozygosity across 23 chromosomes"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <g transform={`translate(${CX}, ${CY})`}>
          {/* Guide circles */}
          <circle r={R_DENSITY_INNER} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={0.5} />
          <circle r={R_HET_OUTER} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={0.5} />
          <circle r={R_HET_INNER} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={0.5} />
        </g>

        <g transform={`translate(${CX}, ${CY})`}>
          <HeterozygosityTrack chromArcs={chromArcs} windowSize={data.windowSize} onHover={setTooltip} />
          <DensityTrack chromArcs={chromArcs} maxDensity={maxDensity} windowSize={data.windowSize} onHover={setTooltip} />
          <ChromosomeRing chromArcs={chromArcs} onHover={setTooltip} />
        </g>

        <CenterStats data={data} />
        <Legend />
      </svg>

      {tooltip !== null && (
        <div style={{ ...tooltipStyles.container, left: tooltip.x, top: tooltip.y }}>
          <div style={tooltipStyles.value}>{tooltip.chromosome}</div>
          {tooltip.position !== null && (
            <div style={tooltipStyles.label}>{tooltip.position}</div>
          )}
          {tooltip.bandName !== null && (
            <div style={tooltipStyles.label}>{tooltip.bandName}</div>
          )}
          {tooltip.snpCount !== null && (
            <div style={tooltipStyles.label}>
              SNPs: <span style={tooltipStyles.value}>{tooltip.snpCount.toLocaleString()}</span>
            </div>
          )}
          {tooltip.hetRate !== null && (
            <div style={tooltipStyles.label}>
              Het: <span style={tooltipStyles.value}>{(tooltip.hetRate * 100).toFixed(1)}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
