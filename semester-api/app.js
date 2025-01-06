const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');

const app = express()
const PORT = 8000

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/about', (req, res) => {
  res.send('About route 🎉 ')
})

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
})

module.exports = app;