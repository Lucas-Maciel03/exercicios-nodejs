const {DataTypes} = require('sequelize')

const User = require('./User')

const db = require('../db/conn')

const Address = db.define('Address', {
    street: {
        type: DataTypes.STRING,
        required: true
    },
    number: {
        type: DataTypes.STRING,
        required: true
    },
    city: {
        type: DataTypes.STRING,
        required: true
    }
})

Address.belongsTo(User) //Address.pertence à um (User)

module.exports = Address