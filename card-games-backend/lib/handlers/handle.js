'use strict';

const httpStatus = require('http-status-codes');

async function handle(res, config) {

  const successStatus = config.successStatus || httpStatus.OK;
  const errorStatus = config.errorStatus || httpStatus.INTERNAL_SERVER_ERROR;
  const errorMessage = config.errorMessage || 'An error happened while trying to query the db';
  const args = config.args || [];

  try {
    const result = await config.fn(...args);
    console.log(result);
    if(!result) {
      return res.status(httpStatus.NOT_FOUND).send({message: 'Not Found'});
    }

    res.status(successStatus).send(result);
  } catch(err) {
    console.error('Error querying databse: ', err);
    res.status(errorStatus).send(errorMessage);
  }
}

module.exports = handle;
