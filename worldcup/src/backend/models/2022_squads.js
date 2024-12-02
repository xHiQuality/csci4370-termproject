const {sequelize, Sequelize} = require(".")

module.exports = (sequelize,Sequelize) => {
    const SQUADS = sequelize.define("squads_2022", {
        ID: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            allowNull: false
        },
        Team: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Position: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Player: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Age: {
            type: Sequelize.BIGINT,
            allowNull: true
        },
        Caps: {
            type: Sequelize.BIGINT,
            allowNull: true
        },
        Goals: {
            type: Sequelize.BIGINT,
            allowNull: true
        },
        WC_Goals: {
            type: Sequelize.BIGINT,
            allowNull: true
        },
        League: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Club: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    })
    return SQUADS;
}