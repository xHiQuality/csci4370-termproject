const {sequelize, Sequelize} = require(".")

module.exports = (sequelize,Sequelize) => {
    const INT_MATCHES = sequelize.define("international_matches", {
        ID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        Tournament: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Date: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Home_Team: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        Home_Goals: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        Away_Goals: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        Away_Team: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        Win_Conditions: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Home_Stadium: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    })
    return INT_MATCHES;
}