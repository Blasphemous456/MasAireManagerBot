const express = require("express");
const cors = require("cors");

const citasRoutes = require("./routes/citas.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/citas", citasRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Servidor backend corriendo en puerto " + PORT);
});