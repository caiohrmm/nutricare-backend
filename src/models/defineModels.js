const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

// Modelos
const Nutricionista = sequelize.define("Nutricionista", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  dataNascimento: { type: DataTypes.DATEONLY, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha: { type: DataTypes.STRING, allowNull: false },
});

const Paciente = sequelize.define("Paciente", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  dataNascimento: { type: DataTypes.DATE, allowNull: false },
  peso: { type: DataTypes.FLOAT, allowNull: false },
  altura: { type: DataTypes.FLOAT, allowNull: false },
  nutricionista_id: { type: DataTypes.INTEGER, allowNull: false },
});

const Consulta = sequelize.define("Consulta", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  data: { type: DataTypes.DATE, allowNull: false },
  observacoes: { type: DataTypes.TEXT },
  paciente_id: { type: DataTypes.INTEGER, allowNull: false },
  nutricionista_id: { type: DataTypes.INTEGER, allowNull: false },
});

const PlanoAlimentar = sequelize.define("PlanoAlimentar", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  descricao: { type: DataTypes.STRING },
  consulta_id: { type: DataTypes.INTEGER, allowNull: false },
});

const Refeicao = sequelize.define("Refeicao", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  horario: { type: DataTypes.TIME, allowNull: false },
  plano_id: { type: DataTypes.INTEGER, allowNull: false },
});

const Alimento = sequelize.define("Alimento", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  calorias: { type: DataTypes.FLOAT, allowNull: false },
  proteinas: { type: DataTypes.FLOAT, allowNull: false },
  carboidratos: { type: DataTypes.FLOAT, allowNull: false },
  gorduras: { type: DataTypes.FLOAT, allowNull: false },
});

const ItemRefeicao = sequelize.define("ItemRefeicao", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  quantidade: { type: DataTypes.FLOAT, allowNull: false },
  refeicao_id: { type: DataTypes.INTEGER, allowNull: false },
  alimento_id: { type: DataTypes.INTEGER, allowNull: false },
});

// Relacionamentos
Nutricionista.hasMany(Paciente, { foreignKey: "nutricionista_id" });
Paciente.belongsTo(Nutricionista, { foreignKey: "nutricionista_id" });

Paciente.hasMany(Consulta, { foreignKey: "paciente_id" });
Consulta.belongsTo(Paciente, { foreignKey: "paciente_id" });

Nutricionista.hasMany(Consulta, { foreignKey: "nutricionista_id" });
Consulta.belongsTo(Nutricionista, { foreignKey: "nutricionista_id" });

Consulta.hasOne(PlanoAlimentar, { foreignKey: "consulta_id" });
PlanoAlimentar.belongsTo(Consulta, { foreignKey: "consulta_id" });

PlanoAlimentar.hasMany(Refeicao, { foreignKey: "plano_id" });
Refeicao.belongsTo(PlanoAlimentar, { foreignKey: "plano_id" });

Refeicao.belongsToMany(Alimento, {
  through: ItemRefeicao,
  foreignKey: "refeicao_id",
});
Alimento.belongsToMany(Refeicao, {
  through: ItemRefeicao,
  foreignKey: "alimento_id",
});

// Sincronizar banco
const defineModels = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
    await sequelize.sync({ alter: true });
    console.log("Todas as tabelas foram sincronizadas com sucesso.");
  } catch (error) {
    console.error("Erro ao sincronizar o banco de dados:", error);
  }
};

module.exports = {
  sequelize,
  defineModels,
  Nutricionista,
  Paciente,
  Consulta,
  PlanoAlimentar,
  Refeicao,
  Alimento,
  ItemRefeicao,
};
