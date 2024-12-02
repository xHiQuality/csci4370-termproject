const express = require("express")
const cors = require("cors")

const app = express()
const db = require("./models")
const { USER } = require("./config/db.config")

db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message)
    });

var corsOptions = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({extended: true}))

const PORT = process.env.PORT || 3001;

/**
 * ADD ROUTES REQUIRE
 * require("./routes/route_name")(app);
 */

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})