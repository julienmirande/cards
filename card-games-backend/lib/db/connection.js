'use strict';

const db = require('./client');
const createDBQuery = require('./createDBQuery');
const insertDBQuery = require('./insertDBQuery');

function ping() {
  return db.getClient().query(`SELECT 'ok'`).then(() => 'PONG');
}

function startDb() {
  return db.getClient().query(createDBQuery);
}

function populateDb() {
  return db.getClient().query(insertDBQuery);
}

function listTables() {
  return db
    .getClient()
    .query(`select * from information_schema.tables where table_type='BASE TABLE' and table_schema='public'`)
    .then(res => res.map(table => table.table_name));
}

function dropDb() {
  return db.getClient().query(`drop schema public cascade;create schema public;`);
}

async function resetDB() {
  await dropDb();
  await startDb();
  await populateDb();
}

module.exports = {
  ping,
  startDb,
  listTables,
  dropDb,
  resetDB
};
