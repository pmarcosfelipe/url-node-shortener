const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

app.get('/', (request, response) => {
  response.json({ message: 'URL Shortener is up!' });
});

app.get('/:id', (request, response) => {
  //TODO redirect to URL
});

app.post('/url', (request, response) => {
  //TODO create a short url
});

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
