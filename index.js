require('dotenv/config');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { loadModules, loadRoutes } = require('./src/utils/index');

const app = express();
app.use(cors())

// MongoDB Connection
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }).then(() => {
    console.log('[Debug]: Database conected!');
    loadModules();

    // Express Routes
    loadRoutes(app);

    app.get('/', (req, res) => {
        res.send('Brza Klopa API..');
    });
});

app.use(express.json());


// Start Express Listen
app.listen(8000);

module.exports = app; // for testing
