// Conecta ao banco
const db = require('./db');
// Cria a tabela Usuario
const Usuario = db.sequelize.define('usuario', {
    id: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: db.Sequelize.STRING,
        allowNull: false,
    },
});

Usuario.sync(); // Sincroniza com o Banco MySql (se não tem a tabela, ele cria)

module.exports = Usuario;