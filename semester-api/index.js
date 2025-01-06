const express = require('express');

const app = express()
const PORT = 8000


app.get('/', (req, res) => {
  res.status(200).send('Hello World')
})

app.get('/about', (req, res) => {
  res.status(200).send('About route 🎉 ')
})

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
})

module.exports = app;