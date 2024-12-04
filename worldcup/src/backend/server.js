const express = require('express');
const teamsRoutes = require('./routes/teams')

const app = express()

app.use(express.json())

app.use('/api/teams', teamsRoutes)

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})