import express from "express";
import cors from "cors";
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(cors());

routes(app);

app.get("/", (req, res) => {
  res.json("Hello World!");
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
