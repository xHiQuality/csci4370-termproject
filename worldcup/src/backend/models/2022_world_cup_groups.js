const {sequelize, Sequelize} = require(".")

module.exports = (sequelize,Sequelize) => {
    const GROUPS = sequelize.define("world_cup_groups_2022", {
        Group: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        Team: {
            type: Sequelize.STRING(20),
            allowNull: true,
            references: {
                model: 'TEAMS',
                key: 'country_name'
            }
        },
        FIFA_Ranking: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    })
    return GROUPS;
}