const {sequelize, Sequelize} = require(".")

module.exports = (sequelize,Sequelize) => {
    const WCHISTORY_MATCHES = sequelize.define("international_matches", {
        ID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        Year: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references : {
                model: 'WORLD_CUPS',
                key: 'Year'
            }
        },
        Date: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Stage: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Home_Team: {
            type: Sequelize.STRING(30),
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
            type: Sequelize.STRING(30),
            allowNull: true
        },
        Win_Conditions: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Host_Team: {
            type: Sequelize.STRING(30),
            allowNull: true
        }
    })
    return WCHISTORY_MATCHES;
}