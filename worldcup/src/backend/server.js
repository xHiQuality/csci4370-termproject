const express = require('express');
const cors = require('cors');

const teamsRoutes = require('./routes/teams');
const squadsRoutes = require('./routes/squads_2022s')
const predictorRoutes = require('./routes/prediction')

const app = express()

app.use(cors());

app.use('/api/teams', teamsRoutes);

app.use('/api/squads', squadsRoutes);

app.use('/api/predictor', predictorRoutes)

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})