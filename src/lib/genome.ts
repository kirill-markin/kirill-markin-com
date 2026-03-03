import { readFileSync } from "fs";
import { resolve } from "path";

import type { GenomeCircosData } from "@/types/genome";

export const getGenomeCircosData = (): GenomeCircosData => {
  const filePath = resolve(process.cwd(), "public", "data", "genome-circos.json");
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as GenomeCircosData;
};
