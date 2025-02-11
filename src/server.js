require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/database"); // Isso já inicia a conexão com o banco

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Testando servidor
app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
