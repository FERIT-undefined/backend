require('dotenv/config');
const express = require('express');
const mongoose = require('mongoose');
const { loadModules, loadRoutes } = require('./src/utils/index');

const app = express();

// MongoDB Connection
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }, () => {
    console.log('[Debug]: Database conected!');
    loadModules();

    // Express Routes
    loadRoutes(app);

    app.get('/', (req, res) => {
        res.send('BrzaKlopa API...');
    });
});
app.use(express.json());


// Start Express Listen
app.listen(8000);