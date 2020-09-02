'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS,HEAD,DELETE');
  next();
});

app.use('/', require('./routers/connectionRouter'));
app.use('/carte', require('./routers/carteRouter'));
app.use('/partie', require('./routers/partieRouter'));
app.use('/deck', require('./routers/deckRouter'));
app.use('/exemplaire', require('./routers/exemplaireRouter'));
app.use('/joueur', require('./routers/joueurRouter'));
app.use('/propriete', require('./routers/proprieteRouter'));
app.use('/stat', require('./routers/statRouter'));

const PORT = process.env.PORT || 3000;

require('./db/connection')
  .startDb()
  .then(
    app.listen(PORT, () => console.log(`Application listening on port ${PORT}`))
  ).catch(err => {
    console.log(err);
  });
