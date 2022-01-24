const express = require('express');
const router = express.Router();

router.get('/',(req, res) => {
    return res.status(200).send("<h1>Welcome from Myanmar Culture Information</h1>")
})

module.exports = router;