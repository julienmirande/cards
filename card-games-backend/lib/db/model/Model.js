'use strict';

class Model {

  constructor() {}

  static getAll() {
    throw new Error('Method getAll should be implemented by each Model class');
  }

  static getById() {
    throw new Error('Method getById should be implemented by each Model class');
  }

  static deleteById() {
    throw new Error('Method deleteById should be implemented by each Model class');
  }

  static updateById() {
    throw new Error('Method updateById should be implemented by each Model class');
  }

  static insert() {
    throw new Error('Method insert should be implemented by each Model class');
  }

}

module.exports = Model;
