const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('hello'))

app.listen(4000, () => console.log('app running on port 4000'))

module.exports = app;