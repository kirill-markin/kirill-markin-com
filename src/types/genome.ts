export type GenomeBand = Readonly<{
  s: number;
  e: number;
  name: string;
  stain: string;
}>;

export type GenomeBin = Readonly<{
  i: number;
  n: number;
  het: number;
}>;

export type GenomeChromosome = Readonly<{
  id: string;
  label: string;
  size: number;
  bands: ReadonlyArray<GenomeBand>;
  bins: ReadonlyArray<GenomeBin>;
}>;

export type GenomeCircosData = Readonly<{
  windowSize: number;
  totalSnps: number;
  totalHet: number;
  chromosomes: ReadonlyArray<GenomeChromosome>;
}>;
