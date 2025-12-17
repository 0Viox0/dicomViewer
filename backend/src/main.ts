import express from "express";
import multer from "multer";
import cors from "cors";
import { parseDicomSeries } from "./parseDicom";

const upload = multer();
const app = express();

app.use(cors());

app.post("/upload", upload.array("files"), async (req, res) => {
  const huThreshold = Number(req.query.hu ?? -300);

  const buffers = (req.files as Express.Multer.File[]).map(
    (file) => file.buffer,
  );

  console.log("started parsing...");
  const result = parseDicomSeries(buffers, huThreshold);
  console.log("finished parsing!");

  res.json(result);
});

app.listen(3001, () => {
  console.log("Backend on http://localhost:3001");
});
