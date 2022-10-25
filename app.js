const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const housesRoute = require('./routes/houseRouter');
const profileRoute = require('./routes/profileRouter');
const loginRouter = require('./routes/loginRouter');
require('dotenv').config()

//app
const app = express();

//middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

//route
app.use('/', loginRouter);
app.use('/houses', housesRoute);
app.use('/', profileRoute);

app.use((req, res, next) => {
    next(new Error('Route Not Found'));
});

app.use((err, req, res, next) => {
    res.status(500).json(err);
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log(`${process.env.NODE_ENV}`);
    if(process.env.NODE_ENV === 'prod') {
        mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.1qgrxyr.mongodb.net/MWA_Product_DB`, { useNewUrlParser: true });
    } else {
        mongoose.connect('mongodb://localhost:27017/mwa-project-db', { useNewUrlParser: true });
    }
});