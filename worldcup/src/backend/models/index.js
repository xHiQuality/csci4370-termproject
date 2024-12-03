const dbConfig = require("../config/db.config.js")

const Sequelize = require("sequelize")
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false 
})

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.teams = require("./teams.js")(sequelize,Sequelize)
db.squads_2022 = require("./2022_squads.js")(sequelize, Sequelize)
db.world_cup_groups_2022 = require("./2022_world_cup_groups.js")(sequelize,Sequelize)
db.world_cup_matches_2022 = require("./2022_world_cup_matches.js")(sequelize,Sequelize)
db.international_matches = require("./international_matches.js")(sequelize,Sequelize)
db.world_cup_matches = require ("./world_cup_matches.js")(sequelize,Sequelize)
db.world_cups = require("./world_cups.js")(sequelize,Sequelize)

module.exports = db;