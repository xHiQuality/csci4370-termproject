const {sequelize, Sequelize} = require(".")

module.exports = (sequelize,Sequelize) => {
    const TEAMS = sequelize.define("teams", {
        ID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        country_name: {
            type: Sequelize.STRING(20),
            primaryKey: true,
            allowNull: false
        },
        flag: {
            type: Sequelize.STRING(200),
            allowNull: false
        }
    })
    return TEAMS;
}