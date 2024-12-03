const {sequelize, Sequelize} = require(".")

module.exports = (sequelize,Sequelize) => {
    const WC_MATCHES = sequelize.define("world_cup_matches_2022", {
        ID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false 
        },
        Year: {
            type: Sequelize.INTEGER,
            allowNull: true
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
            type: Sequelize.STRING(20),
            allowNull: true
        },
        Away_Team: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        Host_Team: {
            type: Sequelize.STRING(20),
            allowNull: true
        }
    })
    return WC_MATCHES;
}