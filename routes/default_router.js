const express = require('express');
const router = express.Router();

router.get('/',(req, res) => {
    return res.status(200).send("<h1>Welcome from Ackstudio who is owend by Acktec</h1>")
})

module.exports = router;