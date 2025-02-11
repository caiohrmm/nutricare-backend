require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize, defineModels } = require("./models/defineModels");

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Testa conexão com o banco e sincroniza tabelas
(async () => {
    try {
        await defineModels();
        console.log("Banco de dados sincronizado e pronto para uso.");
    } catch (error) {
        console.error("Erro ao configurar o banco de dados:", error);
    }
})();

// Rotas
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("API NutriCare está rodando! 🚀");
});

// Configuração da porta
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
