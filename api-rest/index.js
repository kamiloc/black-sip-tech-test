const express = require("express");
const cors = require("cors");

const app = express();
const port = 8000;

const ITEMS = [{ id: "1", name: "Boeign" }, { id: "2", name: "Airbus" }];

app.use(express.json());
app.use(cors());

app.get("/mi-servicio", (req, res) => res.send(ITEMS));

app.post("/mi-servicio", (req, res) => {
  console.log("Los datos del formulario son:", req.body);
  res.sendStatus(200);
});

app.listen(port, () => console.log(`The app listening on port ${port}!`));
