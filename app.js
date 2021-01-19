const express = require('express');
var bodyParser = require('body-parser');
const connectDB = require('./config/dataBase');
var cors = require('cors')

const app = express();
app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


connectDB();
app.use(express.json({extended: false}))
require('./routes')(app);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));