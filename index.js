const express = require("express");
const enviarEmailRoute = require("./routes/enviarEmail");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = 3001;

app.use(express.json());

app.use("/enviarEmail", enviarEmailRoute);

app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
