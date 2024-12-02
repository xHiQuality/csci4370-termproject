const {sequelize, Sequelize} = require(".")

module.exports = (sequelize,Sequelize) => {
    const WORLD_CUPS = sequelize.define("world_cups", {
        Year: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        Host_Country: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Winner: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Runners_Up: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Third: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Fourth: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Goals_Scored: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        Qualified_Teams: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        Matches_Played: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    })
    return WORLD_CUPS;
}