import type { FC } from "react";
import type { DicomResponse } from "../types";

export type MetadataProps = {
  data: DicomResponse;
};

export const Metadata: FC<MetadataProps> = ({ data }) => {
  return (
    <div className="meta">
      <h3>Study Metadata</h3>

      <div className="meta-grid">
        <div>
          <span>Patient: </span>
          <strong>{data.metadata.patientName ?? "—"}</strong>
        </div>

        <div>
          <span>Study: </span>
          <strong>{data.metadata.studyDescription ?? "—"}</strong>
        </div>

        <div>
          <span>Resolution: </span>
          <strong>
            {data.metadata.rows} × {data.metadata.cols}
          </strong>
        </div>

        <div>
          <span>Pixel Spacing: </span>
          <strong>{data.metadata.pixelSpacing ?? "—"}</strong>
        </div>

        <div>
          <span>Slice Thickness: </span>
          <strong>{data.metadata.sliceThickness ?? "—"}</strong>
        </div>

        <div>
          <span>Slices: </span>
          <strong>{data.volume.depth}</strong>
        </div>
      </div>
    </div>
  );
};
