"use client";

import { brushX, curveCatmullRom, extent, line, max, min, scaleLinear, scaleTime, select, utcFormat } from "d3";
import type { D3BrushEvent } from "d3";
import type { ReactElement } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { WeightPoint } from "@/types/weight";

type ParsedPoint = Readonly<{
  date: Date;
  dateRaw: string;
  weightKg: number;
}>;

type Props = Readonly<{
  series: ReadonlyArray<WeightPoint>;
}>;

type TooltipData = Readonly<{
  x: number;
  y: number;
  dateRaw: string;
  weightKg: number;
}>;

const parseUtcDate = (value: string): Date => {
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${value}`);
  }

  return date;
};

const MS_PER_DAY = 86_400_000;
const GAP_THRESHOLD_DAYS = 60;
const HOVER_THRESHOLD_SVG_UNITS = 20;

type GapRegion = Readonly<{
  fromDate: Date;
  toDate: Date;
}>;

const findGaps = (data: ReadonlyArray<ParsedPoint>): ReadonlyArray<GapRegion> => {
  const gaps: Array<GapRegion> = [];

  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1];
    const curr = data[i];
    const daysBetween = (curr.date.getTime() - prev.date.getTime()) / MS_PER_DAY;

    if (daysBetween > GAP_THRESHOLD_DAYS) {
      gaps.push({ fromDate: prev.date, toDate: curr.date });
    }
  }

  return gaps;
};

const buildXTickFormatter = (domainStart: Date, domainEnd: Date): ((tick: Date) => string) => {
  const spanDays = (domainEnd.getTime() - domainStart.getTime()) / MS_PER_DAY;

  if (spanDays > 365) {
    const fmtYear = utcFormat("'%y");
    const fmtMonthYear = utcFormat("%b '%y");

    return (tick: Date): string => {
      if (tick.getUTCMonth() === 0 && tick.getUTCDate() === 1) {
        return fmtYear(tick);
      }
      return fmtMonthYear(tick);
    };
  }

  return utcFormat("%b %d");
};

const tooltipStyles = {
  container: {
    position: "absolute" as const,
    pointerEvents: "none" as const,
    background: "#fff",
    border: "1px solid #232323",
    padding: "6px 10px",
    fontSize: "12px",
    color: "#000",
    fontFamily: "inherit",
    whiteSpace: "nowrap" as const,
    zIndex: 10,
    transform: "translate(-50%, calc(-100% - 12px))",
  },
  date: {
    color: "#898989",
    fontSize: "11px",
  },
  value: {
    fontWeight: 600,
  },
} as const;

export const WeightLineChart = (props: Props): ReactElement => {
  const { series } = props;
  const svgRef = useRef<SVGSVGElement>(null);
  const brushRef = useRef<SVGGElement>(null);
  const xScaleRef = useRef<ReturnType<typeof scaleTime> | null>(null);
  const [zoomDomain, setZoomDomain] = useState<readonly [Date, Date] | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const data = useMemo<ReadonlyArray<ParsedPoint>>(() => {
    return series.map((point) => ({
      date: parseUtcDate(point.date),
      dateRaw: point.date,
      weightKg: point.weightKg,
    }));
  }, [series]);

  const width = 900;
  const height = 420;
  const margin = { top: 24, right: 24, bottom: 44, left: 58 } as const;

  useEffect(() => {
    const node = brushRef.current;
    if (node === null) return;

    const brush = brushX()
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
      .on("end", (event: D3BrushEvent<unknown>) => {
        const selection = event.selection as [number, number] | null;
        if (selection === null) return;
        const [x0, x1] = selection;
        const currentScale = xScaleRef.current;
        if (currentScale === null) return;
        setZoomDomain([currentScale.invert(x0), currentScale.invert(x1)] as const);
        select(node).call(brush.move, null);
      });

    select(node).call(brush);

    return () => {
      select(node).on(".brush", null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (data.length < 2) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Weight over time">
        <text x={width / 2} y={height / 2} textAnchor="middle" fill="#898989" fontSize={14}>
          Not enough data for the selected period.
        </text>
      </svg>
    );
  }

  const xDomain = extent(data, (d) => d.date);
  const xMin = xDomain[0];
  const xMax = xDomain[1];
  if (xMin === undefined || xMax === undefined) {
    throw new Error("Failed to compute X domain.");
  }

  const activeXMin = zoomDomain !== null ? zoomDomain[0] : xMin;
  const activeXMax = zoomDomain !== null ? zoomDomain[1] : xMax;

  const xScale = scaleTime()
    .domain([activeXMin, activeXMax])
    .range([margin.left, width - margin.right]);

  const visibleData = zoomDomain !== null
    ? data.filter((d) => d.date >= zoomDomain[0] && d.date <= zoomDomain[1])
    : data;
  const ySource = visibleData.length >= 2 ? visibleData : data;

  const yMinRaw = min(ySource, (d) => d.weightKg);
  const yMaxRaw = max(ySource, (d) => d.weightKg);
  if (yMinRaw === undefined || yMaxRaw === undefined) {
    throw new Error("Failed to compute Y domain.");
  }

  const yPadding = Math.max(0.6, (yMaxRaw - yMinRaw) * 0.12);
  const yMin = yMinRaw - yPadding;
  const yMax = yMaxRaw + yPadding;

  const yScale = scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin.bottom, margin.top]);

  const xTicks = xScale.ticks(6);
  const yTicks = yScale.ticks(5);
  const xTickFormat = buildXTickFormatter(activeXMin, activeXMax);

  const gaps = findGaps(data);

  const lineGen = line<ParsedPoint>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.weightKg))
    .curve(curveCatmullRom);

  const fullPath = lineGen(data);
  if (fullPath === null) {
    throw new Error("Failed to generate full line path.");
  }

  xScaleRef.current = xScale;

  const handleReset = (): void => {
    setZoomDomain(null);
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>): void => {
    const svgElement = svgRef.current;
    if (svgElement === null) return;

    const rect = svgElement.getBoundingClientRect();
    const svgX = ((event.clientX - rect.left) / rect.width) * width;

    if (svgX < margin.left || svgX > width - margin.right) {
      setTooltip(null);
      return;
    }

    let nearest: ParsedPoint | null = null;
    let nearestDist = Infinity;
    for (const point of data) {
      const px = xScale(point.date);
      const dist = Math.abs(px - svgX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = point;
      }
    }

    if (nearest === null || nearestDist > HOVER_THRESHOLD_SVG_UNITS) {
      setTooltip(null);
      return;
    }

    setTooltip({
      x: (xScale(nearest.date) / width) * 100,
      y: (yScale(nearest.weightKg) / height) * 100,
      dateRaw: nearest.dateRaw,
      weightKg: nearest.weightKg,
    });
  };

  const handleMouseLeave = (): void => {
    setTooltip(null);
  };

  return (
    <>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Weight over time"
        style={{ width: "100%", height: "100%", display: "block" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <clipPath id="weight-chart-clip">
            <rect
              x={margin.left - 6}
              y={margin.top - 6}
              width={width - margin.left - margin.right + 12}
              height={height - margin.top - margin.bottom + 12}
            />
          </clipPath>
          <mask id="weight-segment-mask">
            <rect x={0} y={0} width={width} height={height} fill="white" />
            {gaps.map((gap, i) => (
              <rect
                key={`gap-mask-${i}`}
                x={xScale(gap.fromDate)}
                y={0}
                width={xScale(gap.toDate) - xScale(gap.fromDate)}
                height={height}
                fill="black"
              />
            ))}
          </mask>
        </defs>

        <rect x={0} y={0} width={width} height={height} fill="transparent" />

        {yTicks.map((tick) => {
          const y = yScale(tick);

          return (
            <g key={`y-${tick}`}>
              <line x1={margin.left} x2={width - margin.right} y1={y} y2={y} stroke="rgba(0,0,0,0.08)" />
              <text x={margin.left - 10} y={y} textAnchor="end" dominantBaseline="middle" fill="#898989" fontSize={12}>
                {tick.toFixed(1)}
              </text>
            </g>
          );
        })}

        {xTicks.map((tick) => {
          const x = xScale(tick);
          const label = xTickFormat(tick);

          return (
            <g key={`x-${tick.toISOString()}`}>
              <line x1={x} x2={x} y1={margin.top} y2={height - margin.bottom} stroke="rgba(0,0,0,0.06)" />
              <text x={x} y={height - margin.bottom + 18} textAnchor="middle" fill="#898989" fontSize={12}>
                {label}
              </text>
            </g>
          );
        })}

        <g clipPath="url(#weight-chart-clip)">
          <path d={fullPath} fill="none" stroke="#232323" strokeWidth={1.5} strokeDasharray="6 4" opacity={0.3} />
          <path d={fullPath} fill="none" stroke="#232323" strokeWidth={2} mask="url(#weight-segment-mask)" />

          {data.map((point) => {
            const x = xScale(point.date);
            const y = yScale(point.weightKg);

            return (
              <circle
                key={`${point.dateRaw}-${point.weightKg}`}
                cx={x}
                cy={y}
                r={4}
                fill="#ffffff"
                stroke="#232323"
                strokeWidth={2}
              />
            );
          })}
        </g>

        <text x={margin.left} y={margin.top - 10} fill="#898989" fontSize={12}>
          kg
        </text>

        {zoomDomain !== null && (
          <g cursor="pointer" onClick={handleReset}>
            <rect x={width - margin.right - 52} y={4} width={52} height={20} rx={3} fill="#898989" opacity={0.15} />
            <text x={width - margin.right - 26} y={17} textAnchor="middle" fill="#898989" fontSize={11}>
              Reset
            </text>
          </g>
        )}

        <g ref={brushRef} />
      </svg>

      {tooltip !== null && (
        <div style={{ ...tooltipStyles.container, left: `${tooltip.x}%`, top: `${tooltip.y}%` }}>
          <div style={tooltipStyles.date}>{tooltip.dateRaw}</div>
          <div style={tooltipStyles.value}>{tooltip.weightKg.toFixed(1)} kg</div>
        </div>
      )}
    </>
  );
};
