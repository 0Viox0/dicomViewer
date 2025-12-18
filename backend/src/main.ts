import express from "express";
import multer from "multer";
import cors from "cors";
import { parseDicomSeries } from "./parseDicom";

const upload = multer();
const app = express();

app.use(cors());

app.post("/upload", upload.array("files"), (req, res) => {
  const huThreshold = Number(req.query.hu ?? 400);

  const buffers = (req.files as Express.Multer.File[]).map(
    (file) => file.buffer,
  );

  console.log("Parsing with HU:", huThreshold);
  const result = parseDicomSeries(buffers, huThreshold);
  console.log("Finished");

  res.json(result);
});

app.listen(3001, () => {
  console.log("Backend on http://localhost:3001");
});
