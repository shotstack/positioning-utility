const express = require('express');
const path = require('path');

const app = express();
const port = 8080;

app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.listen(port, () => {});
