import dicomParser from "dicom-parser";
import type { DicomResponse, Metadata, ParsedSlice } from "./types";

export const parseDicomSeries = (
  buffers: Buffer[],
  huThreshold: number,
): DicomResponse => {
  const slices: ParsedSlice[] = [];
  let metadata: Metadata = {};

  for (const buffer of buffers) {
    const dataSet = dicomParser.parseDicom(buffer);

    const rows = dataSet.uint16("x00280010");
    const cols = dataSet.uint16("x00280011");
    const intercept = dataSet.floatString("x00281052") ?? 0;
    const slope = dataSet.floatString("x00281053") ?? 1;
    const position = Number(dataSet.string("x00200032")?.split("\\")[2] ?? 0);

    const pixelData = dataSet.elements.x7fe00010;

    if (!pixelData) {
      throw new Error("no pixel data was found");
    }

    if (!cols) {
      throw new Error("columns were not found");
    }

    if (!rows) {
      throw new Error("row were not found");
    }

    const pixels = new Int16Array(
      dataSet.byteArray.buffer,
      pixelData.dataOffset,
      rows * cols,
    );

    for (let i = 0; i < pixels.length; i++) {
      // @ts-expect-error everything would be fine
      pixels[i] = pixels[i] * slope + intercept;
    }

    slices.push({ pixels, position });

    metadata = {
      rows,
      cols,
      pixelSpacing: dataSet.string("x00280030"),
      sliceThickness: dataSet.string("x00180050"),
      patientName: dataSet.string("x00100010"),
      studyDescription: dataSet.string("x00081030"),
    };
  }

  slices.sort((a, b) => a.position - b.position);

  const mask = slices.map((slice) =>
    Array.from(slice.pixels, (v) => (v >= huThreshold ? 1 : 0)),
  );

  return {
    metadata,
    volume: {
      width: metadata.cols,
      height: metadata.rows,
      depth: slices.length,
      mask,
    },
  };
};
