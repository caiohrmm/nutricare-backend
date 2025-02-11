const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Nutricionista } = require("../models/defineModels");
const { validationResult } = require("express-validator");

// Função para gerar token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Registro de nutricionista
exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nome, email, senha, data_nascimento } = req.body;

        // Verifica se o nutricionista já existe
        let nutricionista = await Nutricionista.findOne({ where: { email } });
        if (nutricionista) {
            return res.status(400).json({ message: "E-mail já está em uso." });
        }

        // Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        // Cria o nutricionista
        nutricionista = await Nutricionista.create({
            nome,
            email,
            senha: hashedPassword,
            dataNascimento: data_nascimento,
        });

        // Gera o token JWT
        const token = generateToken(nutricionista.id);
        res.status(201).json({ message: "Cadastro realizado com sucesso!", token });
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor", error });
    }
};

// Login do nutricionista
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Verifica se o nutricionista existe
        const nutricionista = await Nutricionista.findOne({ where: { email } });
        if (!nutricionista) {
            return res.status(400).json({ message: "E-mail ou senha inválidos." });
        }

        // Compara a senha digitada com a senha salva no banco
        const isMatch = await bcrypt.compare(senha, nutricionista.senha);
        if (!isMatch) {
            return res.status(400).json({ message: "E-mail ou senha inválidos." });
        }

        // Gera um novo token JWT
        const token = generateToken(nutricionista.id);
        res.json({ message: "Login realizado com sucesso!", token });
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor", error });
    }
};
