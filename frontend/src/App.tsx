import { useState } from "react";
import axios from "axios";
import VolumeView from "./VolumeView";

export default function App() {
  const [data, setData] = useState<any>(null);
  const [hu, setHu] = useState(-300);

  async function upload(files: FileList | null) {
    if (!files) return;

    const form = new FormData();
    Array.from(files).forEach((f) => form.append("files", f));

    const res = await axios.post(`http://localhost:3001/upload?hu=${hu}`, form);

    setData(res.data);
  }

  return (
    <div>
      <input type="file" multiple onChange={(e) => upload(e.target.files)} />

      <input
        type="range"
        min={-1000}
        max={1000}
        value={hu}
        onChange={(e) => setHu(+e.target.value)}
      />
      <span>HU: {hu}</span>

      {data && (
        <>
          <pre>{JSON.stringify(data.metadata, null, 2)}</pre>
          <VolumeView volume={data.volume} />
        </>
      )}
    </div>
  );
}
