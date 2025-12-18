import { useEffect, useRef, useState } from "react";
import axios from "axios";
import VolumeView from "./VolumeView";

import "./App.css";

export default function App() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [data, setData] = useState<any>(null);
  const [hu, setHu] = useState(400);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<number | null>(null);

  async function sendRequest(currentHu: number) {
    if (!files) return;

    const form = new FormData();
    Array.from(files).forEach((f) => form.append("files", f));

    setLoading(true);

    const res = await axios.post(
      `http://localhost:3001/upload?hu=${currentHu}`,
      form,
    );

    setData(res.data);
    setLoading(false);
  }

  function onHuChange(value: number) {
    setHu(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      sendRequest(value);
    }, 400);
  }

  return (
    <div className="app">
      <h1>DICOM Volume Viewer</h1>

      <div className="controls">
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />

        <button onClick={() => sendRequest(hu)} disabled={!files || loading}>
          {loading ? "Generating..." : "Generate"}
        </button>

        <div className="slider">
          <label>HU Threshold: {hu}</label>
          <input
            type="range"
            min={-1000}
            max={1000}
            value={hu}
            style={{ width: "300px" }}
            onChange={(e) => onHuChange(+e.target.value)}
          />
        </div>
      </div>

      {loading && <div className="spinner" />}

      {data && !loading && <VolumeView volume={data.volume} useStep={hu < 0} />}
    </div>
  );
}
