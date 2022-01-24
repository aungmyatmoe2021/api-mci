const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./routes/router.js');
const default_router = require('./routes/default_router');

// set up port
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// add routes
app.use('/call/api/v1', router);
app.use('/',default_router);

// run server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));