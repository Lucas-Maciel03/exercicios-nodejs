const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('nodemvc', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Conectado ao Banco!')
} catch (error) {
    console.log('Nao foi possivel conectar' + error)
}

module.exports = sequelize
