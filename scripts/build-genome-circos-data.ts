/**
 * Preprocessing script for genome Circos visualization.
 *
 * Reads raw SNP genotyping TSV + hg19 cytoband/chrom-sizes reference data,
 * computes per-window (1 Mb) SNP density and heterozygosity rate,
 * outputs a compact JSON consumed by the GenomeCircos component.
 *
 * Usage:  npx tsx scripts/build-genome-circos-data.ts
 * Output: public/data/genome-circos.json
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CytoBand = {
  chrom: string;
  start: number;
  end: number;
  name: string;
  stain: string;
};

type ChromosomeOutput = {
  id: string;
  label: string;
  size: number;
  bands: ReadonlyArray<{
    s: number;
    e: number;
    name: string;
    stain: string;
  }>;
  bins: ReadonlyArray<{
    i: number;
    n: number;
    het: number;
  }>;
};

type CircosData = {
  windowSize: number;
  totalSnps: number;
  totalHet: number;
  chromosomes: ReadonlyArray<ChromosomeOutput>;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WINDOW_SIZE = 1_000_000; // 1 Mb

const CANONICAL_CHROMS = [
  "chr1", "chr2", "chr3", "chr4", "chr5", "chr6",
  "chr7", "chr8", "chr9", "chr10", "chr11", "chr12",
  "chr13", "chr14", "chr15", "chr16", "chr17", "chr18",
  "chr19", "chr20", "chr21", "chr22", "chrX",
] as const;

const CHROM_LABEL_MAP: Record<string, string> = {
  chr1: "1", chr2: "2", chr3: "3", chr4: "4", chr5: "5", chr6: "6",
  chr7: "7", chr8: "8", chr9: "9", chr10: "10", chr11: "11", chr12: "12",
  chr13: "13", chr14: "14", chr15: "15", chr16: "16", chr17: "17", chr18: "18",
  chr19: "19", chr20: "20", chr21: "21", chr22: "22", chrX: "X",
};

const ROOT = resolve(__dirname, "..");
const GENOME_DATA_DIR = resolve(__dirname, "genome-data");
const SNP_URL = "https://storage.googleapis.com/personal-public-data-km/raw/genome_snps-kirill_markin-atlas_ru-2022_02_22.txt";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const isHeterozygous = (genotype: string): boolean => {
  if (genotype.length !== 2) return false;
  return genotype[0] !== genotype[1];
};

const normalizeChrom = (raw: string): string => {
  const trimmed = raw.trim();
  if (trimmed.startsWith("chr")) return trimmed;
  return `chr${trimmed}`;
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("=== Building genome Circos data ===");

  // 1. Load chromosome sizes
  console.log("Loading chromosome sizes...");
  const chromSizesPath = resolve(GENOME_DATA_DIR, "hg19.chrom.sizes");
  const chromSizesRaw = readFileSync(chromSizesPath, "utf-8");
  const chromSizes = new Map<string, number>();
  for (const line of chromSizesRaw.split("\n")) {
    const parts = line.split("\t");
    if (parts.length >= 2) {
      chromSizes.set(parts[0], parseInt(parts[1], 10));
    }
  }

  // 2. Load cytoband data
  console.log("Loading cytoband data...");
  const cytoBandPath = resolve(GENOME_DATA_DIR, "cytoBand.txt");
  const cytoBandRaw = readFileSync(cytoBandPath, "utf-8");
  const cytoBands: Array<CytoBand> = [];
  for (const line of cytoBandRaw.split("\n")) {
    const parts = line.split("\t");
    if (parts.length >= 5) {
      cytoBands.push({
        chrom: parts[0],
        start: parseInt(parts[1], 10),
        end: parseInt(parts[2], 10),
        name: parts[3],
        stain: parts[4].trim(),
      });
    }
  }

  // 3. Download or read cached SNP data
  const snpCachePath = resolve(GENOME_DATA_DIR, "genome_snps.txt");
  let snpRaw: string;

  if (existsSync(snpCachePath)) {
    console.log("Reading cached SNP data...");
    snpRaw = readFileSync(snpCachePath, "utf-8");
  } else {
    console.log(`Downloading SNP data from ${SNP_URL}...`);
    const response = await fetch(SNP_URL);
    if (!response.ok) {
      throw new Error(`Failed to download SNP data: ${response.status} ${response.statusText}`);
    }
    snpRaw = await response.text();
    writeFileSync(snpCachePath, snpRaw);
    console.log(`Cached SNP data to ${snpCachePath}`);
  }

  // 4. Parse SNP data and aggregate into bins
  console.log("Parsing and aggregating SNP data...");
  const canonicalSet = new Set<string>(CANONICAL_CHROMS);

  // Initialize bins per chromosome
  const chromBins = new Map<string, Map<number, { n: number; het: number }>>();
  for (const chrom of CANONICAL_CHROMS) {
    chromBins.set(chrom, new Map());
  }

  let totalSnps = 0;
  let totalHet = 0;
  let skipped = 0;

  const lines = snpRaw.split("\n");
  for (const line of lines) {
    if (line.startsWith("#") || line.trim() === "") continue;

    const parts = line.split("\t");
    if (parts.length < 4) continue;

    const chrom = normalizeChrom(parts[1]);
    const position = parseInt(parts[2], 10);
    const genotype = parts[3].trim();

    if (!canonicalSet.has(chrom)) {
      skipped++;
      continue;
    }

    if (genotype === "--" || genotype === "" || genotype.length !== 2) {
      skipped++;
      continue;
    }

    const binIndex = Math.floor(position / WINDOW_SIZE);
    const bins = chromBins.get(chrom)!;

    let bin = bins.get(binIndex);
    if (bin === undefined) {
      bin = { n: 0, het: 0 };
      bins.set(binIndex, bin);
    }

    bin.n++;
    totalSnps++;

    if (isHeterozygous(genotype)) {
      bin.het++;
      totalHet++;
    }
  }

  console.log(`Total SNPs processed: ${totalSnps}`);
  console.log(`Total heterozygous: ${totalHet} (${((totalHet / totalSnps) * 100).toFixed(1)}%)`);
  console.log(`Skipped entries: ${skipped}`);

  // 5. Build output structure
  const chromosomes: Array<ChromosomeOutput> = [];

  for (const chrom of CANONICAL_CHROMS) {
    const size = chromSizes.get(chrom);
    if (size === undefined) {
      throw new Error(`Missing chromosome size for ${chrom}`);
    }

    const bands = cytoBands
      .filter((b) => b.chrom === chrom)
      .map((b) => ({ s: b.start, e: b.end, name: b.name, stain: b.stain }));

    const binMap = chromBins.get(chrom)!;
    const bins: Array<{ i: number; n: number; het: number }> = [];
    for (const [binIndex, data] of binMap.entries()) {
      bins.push({ i: binIndex, n: data.n, het: data.het });
    }
    bins.sort((a, b) => a.i - b.i);

    chromosomes.push({
      id: chrom,
      label: CHROM_LABEL_MAP[chrom] ?? chrom,
      size,
      bands,
      bins,
    });
  }

  const output: CircosData = {
    windowSize: WINDOW_SIZE,
    totalSnps,
    totalHet,
    chromosomes,
  };

  // 6. Write output
  const outputDir = resolve(ROOT, "public", "data");
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = resolve(outputDir, "genome-circos.json");
  writeFileSync(outputPath, JSON.stringify(output));
  const fileSizeKb = Math.round(readFileSync(outputPath).length / 1024);
  console.log(`\nOutput written to ${outputPath} (${fileSizeKb} KB)`);
  console.log("=== Done ===");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
