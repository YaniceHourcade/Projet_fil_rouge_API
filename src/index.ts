import express from "express";
import artistRoute from "./routes/artist";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/artists", artistRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
