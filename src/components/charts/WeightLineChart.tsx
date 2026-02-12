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

const parseUtcDate = (value: string): Date => {
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${value}`);
  }

  return date;
};

const MS_PER_DAY = 86_400_000;
const GAP_THRESHOLD_DAYS = 60;

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

export const WeightLineChart = (props: Props): ReactElement => {
  const { series } = props;
  const brushRef = useRef<SVGGElement>(null);
  const [zoomDomain, setZoomDomain] = useState<readonly [Date, Date] | null>(null);

  const data = useMemo<ReadonlyArray<ParsedPoint>>(() => {
    if (series.length < 2) {
      throw new Error("Weight series must have at least 2 points.");
    }

    return series.map((point) => ({
      date: parseUtcDate(point.date),
      dateRaw: point.date,
      weightKg: point.weightKg,
    }));
  }, [series]);

  const width = 900;
  const height = 420;
  const margin = { top: 24, right: 24, bottom: 44, left: 58 } as const;

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

  const xScaleRef = useRef(xScale);
  xScaleRef.current = xScale;

  useEffect(() => {
    const node = brushRef.current;
    if (node === null) return;

    const brush = brushX()
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
      .on("end", (event: D3BrushEvent<unknown>) => {
        const selection = event.selection as [number, number] | null;
        if (selection === null) return;
        const [x0, x1] = selection;
        setZoomDomain([xScaleRef.current.invert(x0), xScaleRef.current.invert(x1)] as const);
        select(node).call(brush.move, null);
      });

    select(node).call(brush);

    return () => {
      select(node).on(".brush", null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = (): void => {
    setZoomDomain(null);
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Weight over time">
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
            <g key={`${point.dateRaw}-${point.weightKg}`}>
              <circle cx={x} cy={y} r={4} fill="#ffffff" stroke="#232323" strokeWidth={2} />
              <title>
                {point.dateRaw}: {point.weightKg.toFixed(1)} kg
              </title>
            </g>
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
  );
};
