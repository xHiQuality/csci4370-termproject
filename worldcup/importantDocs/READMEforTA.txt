Contributors: Cason Pittman, Samantha Malacuso, Sean Malavet

Steps to Run:

1) Go into MySQL and create a database called 'world_cup'
2) Use the file "schema_and_data.sql" to load all of the tables and data.
3) In /worldcup run npm install to install all dependencies, a list can be found in package-lock.json
4) Confirm that /worldcup/src/backend/db/connection.js & /worldcup/src/backend/db/connection2.js are properly set to your settings in MySQL
    To test this cd into backend and try node test.js
5) In directory .../app do the following command: npm run dev
    This will start the backend server on PORT: 3001
    & the frontend server on PORT: 3000
    Click the link provided in the terminal to access page

What to do inside:

Inside the website there are 3 different pages that have various levels of complexity in regard to queries.

The Dashboard allows you to compare 2 different teams in the World Cup. All data on the website is taken from the database
The Favorite Team page is a more in depth look at a specific team and uses aggregate functions to see top goal scorers and players with most appearances.

The Holy Grail is the Predictor page which, on each run simulates the tournament using multiple queries and a prediction formula. The formula can be found in
worldcup/importantDocs/krabby patty secret formula. It is complex taking in many variables and multiple queries. This formula is self made and contains what I believe to be
fair weights and qualifiers for a good football team. Try this page multiple times and see the results!

The code for the Tournament simulation can be found at worldcup/src/backend/routes/prediction.js under the all-group-predictions route OR in postman
http://localhost:3001/api/predictor/all-group-predictions

Thank you! And I hope you enjoy our term project!
