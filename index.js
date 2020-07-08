const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const mongoose = require('mongoose');
const cors = require('cors');
const { nanoid } = require('nanoid');

const URL = require('./model/URL');

require('dotenv').config();

mongoose.connect(
  'mongodb+srv://pmarcosfelipe:s1f65v9200@cluster0.1uym1.mongodb.net/url-shortener?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

const schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
});

app.post('/url', async (request, response, next) => {
  let { slug, url } = request.body;
  try {
    await schema.validate({
      slug,
      url,
    });

    if (!slug) {
      slug = nanoid(5);
    } else {
      console.log();
      let alreadyExist = await URL.findOne({ slug });
      if (alreadyExist) {
        throw new Error('Slug in use!');
      }
    }

    slug = slug.toLowerCase();
    const newURL = {
      url,
      slug,
    };

    let created = await URL.create(newURL);
    response.json(created);
  } catch (error) {
    next(error);
  }
});

app.get('/:slug', async (request, response) => {
  const { slug } = request.params;
  try {
    const url = await URL.findOne({ slug });
    if (url) {
      response.redirect(url.url);
    }
    response.redirect(`/?error=${slug} not found`);
  } catch (error) {
    response.redirect(`/?error=Link not found`);
  }
});

app.use((error, request, response, next) => {
  if (error.status) {
    response.status(error.status);
  } else {
    response.status(500);
  }
  response.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : error.stack,
  });
});

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
