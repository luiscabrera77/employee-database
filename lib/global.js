// Required modules
const mysql = require('mysql2');
const util = require("util");

// Database Connection
const db = require('../db/connection');

// Promisify the connection.query method
const queryAsync = util.promisify(db.query).bind(db);

const globalQueries = {

  // cRud - READ
  selectTableCol: async (column, table) => {
    try {
      const data = await queryAsync(`SELECT ${column} FROM ${table};`);
      const dataList = data.map(item => item[column]);
      return dataList;
    }
    catch (error) {
      console.log("Error in global.js selectTableCol(): " + error);
    }
  },

  // Crud - CREATE
  insertRecord: async (table, colValues) => {
    try {
      const data = await queryAsync(`INSERT INTO ${table} SET ?`, colValues);
      if (data.affectedRows > 1) {
        error = `More than one record was inserted in the ${table} table`;
        throw error;
      }
      else if (data.affectedRows === 0) {
        error = `Nothing was inserted in the ${table} table`;
        throw error;
      }
      return data;
    }
    catch (error) {
      console.log("Error in global.js insertRecord(): " + error);
    }
  },

  // cruD - DELETE
  deleteRecord: async (table, columnName, columnValue) => {
    try {
      const data = await queryAsync(`DELETE FROM ${table} WHERE ${columnName} = ${columnValue}`);
      // Throw error if there are no or multiple affected rows 
      if (data.affectedRows > 1) {
        error = `More than one record was deleted from the ${table} table`;
        throw error;
      }
      else if (data.affectedRows === 0) {
        error = `Nothing was deleted from the ${table} table`;
        throw error;
      }
      return data;
    }
    catch (error) {
      console.log("Error in global.js deleteRecord(): " + error);
    }
  },

  // crUd - UPDATE
  updateRecord: async (table, setColName, setColValue, whereColName, whereColValue) => {
    try {
      const data = await queryAsync(`UPDATE ${table} SET ${setColName} = ${setColValue} WHERE ${whereColName} = ${whereColValue};`);
      if (data.affectedRows > 1) {
        error = `More than one record was updated in the ${table} table`;
        throw error;
      }
      else if (data.affectedRows === 0) {
        error = `Nothing was updated in the ${table} table`;
        throw error;
      }
      return data;
    }
    catch (error) {
      console.log("Error in global.js updateRecord(): " + error);
    }
  }
}

module.exports = globalQueries;