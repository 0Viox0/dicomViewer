export type ParsedSlice = {
  pixels: Int16Array;
  position: number;
};

export type Metadata = {
  rows?: number;
  cols?: number;
  pixelSpacing?: string;
  sliceThickness?: string;
  patientName?: string;
  studyDescription?: string;
};

export type Volume = {
  width: number;
  height: number;
  depth: number;
  mask: (0 | 1)[][];
};

export type DicomResponse = {
  metadata: Metadata;
  volume: Volume;
};
