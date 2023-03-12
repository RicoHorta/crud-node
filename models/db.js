//Cria a "classe" Sequelize
const Sequelize = require('sequelize');
// Instancia o objeto sequelize informando BANCO, USUARIO e SENHA
const sequelize = new Sequelize('node-crud', 'root', '', {
    host: '127.0.0.1', //ip do servidor mysql
    dialect: 'mysql',  // Banco de Dados
    define: {
        charset: 'utf8',  // alfabeto
        collate: 'utf8_general_ci',
        timestamps: true // Data e hora de cada movimento no banco
    },
    logging: false //tira o excesso de log no terminal a cada interação do o banco
})
//TESTANDO CONECÇÃO COM O BANCO
// sequelize.authenticate().then(function () {
//     console.log('Sucesso');
// }).catch(function (err) {
//     console.log('error: ' + err);
// })
module.exports = { Sequelize, sequelize } //Exporta o módulo e o objeto com a configuração de acesso