"use client";

import type { ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";

import type { WeightPoint } from "@/types/weight";
import { WeightLineChart } from "@/components/charts/WeightLineChart";

const toDateInputValue = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

type Props = Readonly<{
  series: ReadonlyArray<WeightPoint>;
}>;

const filterStyles = {
  wrapper: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-end",
    flexWrap: "wrap" as const,
    marginBottom: "1rem",
  },
  label: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
    fontSize: "12px",
    color: "#898989",
  },
  input: {
    fontFamily: "inherit",
    fontSize: "13px",
    padding: "4px 8px",
    border: "1px solid #ddd",
    borderRadius: "0",
    background: "transparent",
    color: "inherit",
  },
  count: {
    fontSize: "12px",
    color: "#898989",
    alignSelf: "flex-end" as const,
    paddingBottom: "4px",
  },
  reset: {
    fontFamily: "inherit",
    fontSize: "12px",
    padding: "4px 10px",
    border: "1px solid #ddd",
    borderRadius: "0",
    background: "transparent",
    color: "#898989",
    cursor: "pointer",
    alignSelf: "flex-end" as const,
    marginBottom: "1px",
  },
} as const;

const DEFAULT_FROM = (): string => toDateInputValue(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));
const DEFAULT_TO = (): string => toDateInputValue(new Date());

export const WeightDashboard = (props: Props): ReactElement => {
  const { series } = props;

  const [dateFrom, setDateFrom] = useState<string>(DEFAULT_FROM);
  const [dateTo, setDateTo] = useState<string>(DEFAULT_TO);

  const filteredSeries = useMemo<ReadonlyArray<WeightPoint>>(() => {
    return series.filter((point) => {
      if (dateFrom && point.date < dateFrom) return false;
      if (dateTo && point.date > dateTo) return false;
      return true;
    });
  }, [series, dateFrom, dateTo]);

  const handleDateRangeChange = useCallback((newFrom: string, newTo: string): void => {
    setDateFrom(newFrom);
    setDateTo(newTo);
  }, []);

  const handleReset = (): void => {
    setDateFrom(DEFAULT_FROM());
    setDateTo(DEFAULT_TO());
  };

  const isDefaultRange = dateFrom === DEFAULT_FROM() && dateTo === DEFAULT_TO();

  return (
    <>
      <div style={filterStyles.wrapper}>
        <label style={filterStyles.label}>
          From
          <input
            type="date"
            style={filterStyles.input}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </label>
        <label style={filterStyles.label}>
          To
          <input
            type="date"
            style={filterStyles.input}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </label>
        <span style={filterStyles.count}>
          {filteredSeries.length} entries
        </span>
        {!isDefaultRange && (
          <button type="button" style={filterStyles.reset} onClick={handleReset}>
            Reset
          </button>
        )}
      </div>
      <div style={{ position: "relative", width: "100%", aspectRatio: "900 / 420", minHeight: 240 }}>
        <WeightLineChart series={filteredSeries} onDateRangeChange={handleDateRangeChange} />
      </div>
    </>
  );
};
