const express = require('express');
const app = express();
const env = require('dotenv')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const passwordRoute = require('./routes/password')
const tokensRoute = require('./routes/tokens')
const permissionsRoute = require('./routes/permissions')
//mi permette di richiamare le variabili dentro il file .env
env.config()

mongoose.connect(process.env.DB_CONNECTION)
//Route middleware
//Prefix for authRoute
app.use(express.json()) //parse for send json to request

app.use('/api/user', authRoute)

app.use('/api/password', passwordRoute)

app.use('/api/tokens', tokensRoute)

app.use('/api/permissions', permissionsRoute)

module.exports = app