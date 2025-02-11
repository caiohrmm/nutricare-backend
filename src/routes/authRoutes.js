const express = require("express");
const { check } = require("express-validator");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Rota de Registro
router.post(
  "/register",
  [
    check("nome", "Nome é obrigatório").not().isEmpty(),
    check("email", "E-mail inválido").isEmail(),
    check("senha", "A senha deve ter pelo menos 6 caracteres").isLength({
      min: 6,
    }),
    check("data_nascimento", "Data de nascimento inválida")
      .isDate()
      .withMessage("Data deve ser válida")
      .custom((value) => {
        // Verifica se a data está no formato YYYY-MM-DD
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(value)) {
          throw new Error("Data deve estar no formato YYYY-MM-DD");
        }
        return true;
      }),
  ],
  register
);

// Rota de Login
router.post("/login", login);

module.exports = router;
