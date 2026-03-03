"use client";

import type { ReactElement, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";

type Props = Readonly<{
  title: string;
  children: ReactNode;
}>;

const buttonStyle = {
  position: "absolute" as const,
  top: 0,
  right: 0,
  background: "transparent",
  border: "1px solid #ddd",
  padding: "4px 8px",
  fontSize: "12px",
  color: "#898989",
  cursor: "pointer",
  fontFamily: "inherit",
  lineHeight: 1,
  zIndex: 2,
} as const;

const overlayStyles = {
  backdrop: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(255, 255, 255, 0.97)",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column" as const,
    overflow: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between" as const,
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #ddd",
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 600,
  },
  closeButton: {
    background: "transparent",
    border: "1px solid #ddd",
    padding: "6px 14px",
    fontSize: "13px",
    color: "#232323",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  content: {
    flex: 1,
    padding: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
} as const;

export const ChartFullscreen = (props: Props): ReactElement => {
  const { title, children } = props;
  const [isFullscreen, setIsFullscreen] = useState(false);

  const open = useCallback(() => setIsFullscreen(true), []);
  const close = useCallback(() => setIsFullscreen(false), []);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleEsc = (e: KeyboardEvent): void => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isFullscreen, close]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <button type="button" style={buttonStyle} onClick={open} aria-label="Expand chart to fullscreen">
          Expand
        </button>
        {children}
      </div>

      {isFullscreen && (
        <div style={overlayStyles.backdrop}>
          <div style={overlayStyles.header}>
            <h2 style={overlayStyles.title}>{title}</h2>
            <button type="button" style={overlayStyles.closeButton} onClick={close}>
              Close
            </button>
          </div>
          <div style={overlayStyles.content}>
            <div style={{ width: "100%", maxWidth: "1400px" }}>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
