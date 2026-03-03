"use client";

import type { ReactElement } from "react";
import { useMemo, useState } from "react";

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
    borderRadius: "4px",
    background: "transparent",
    color: "inherit",
  },
  count: {
    fontSize: "12px",
    color: "#898989",
    alignSelf: "flex-end" as const,
    paddingBottom: "4px",
  },
} as const;

export const WeightDashboard = (props: Props): ReactElement => {
  const { series } = props;

  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  const [dateFrom, setDateFrom] = useState<string>(toDateInputValue(oneYearAgo));
  const [dateTo, setDateTo] = useState<string>(toDateInputValue(now));

  const filteredSeries = useMemo<ReadonlyArray<WeightPoint>>(() => {
    return series.filter((point) => {
      if (dateFrom && point.date < dateFrom) return false;
      if (dateTo && point.date > dateTo) return false;
      return true;
    });
  }, [series, dateFrom, dateTo]);

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
      </div>
      <div style={{ position: "relative", width: "100%", aspectRatio: "900 / 420", minHeight: 240 }}>
        <WeightLineChart series={filteredSeries} />
      </div>
    </>
  );
};
