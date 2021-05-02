// Required modules
const mysql = require('mysql2');
const util = require("util");

// Database Connection
const db = require('../db/connection');

// Promisify the connection.query method
const queryAsync = util.promisify(db.query).bind(db);

const globalQueries = {

  // Get a column in one table
  selectTableCol: async (column, table) => {
    try {
      const data = await queryAsync(`SELECT ${column} FROM ${table};`);
      const dataList = data.map(item => item[column]);
      return dataList;
    }
    catch (error) {
      console.log("Error in globalQueries selectTableCol(): " + error);
    }
  },

  // Insert record
  insertRecord: async (table, colValues) => {
    try {
      const data = await queryAsync(`INSERT INTO ${table} SET ?`, colValues);
      // Throw error if there are no or multiple affected rows 
      if (data.affectedRows > 1) {
        error = `Cannot identify a unique record in the ${table} table`;
        throw error;
      }
      else if (data.affectedRows === 0) {
        error = `Nothing was inserted in the ${table} table`;
        throw error;
      }
      return data;
    }
    catch (error) {
      console.log("Error in globalQueries insertRecord(): " + error);
    }
  },

  // Delete record
  deleteRecord: async (table, columnName, columnValue) => {
    try {
      const data = await queryAsync(`DELETE FROM ${table} WHERE ${columnName} = ${columnValue}`);
      // Throw error if there are no or multiple affected rows 
      if (data.affectedRows > 1) {
        error = `More than one entry was deleted from the ${table} table`;
        throw error;
      }
      else if (data.affectedRows === 0) {
        error = `No entries were deleted from the ${table} table`;
        throw error;
      }
      return data;
    }
    catch (error) {
      console.log("ERROR - sql-queries.js - sqlQueries.deleteRecord(): " + error);
    }
  },

  // Update record into database
  updateRecord: async (table, setColName, setColValue, whereColName, whereColValue) => {
    try {
      const data = await queryAsync(`UPDATE ${table} SET ${setColName} = ${setColValue} WHERE ${whereColName} = ${whereColValue};`);
      // Throw error if there are no or multiple affected rows 
      if (data.affectedRows > 1) {
        error = `More than one entry was updated in the ${table} table`;
        throw error;
      }
      else if (data.affectedRows === 0) {
        error = `No entries were updated in the ${table} table`;
        throw error;
      }
      return data;
    }
    catch (error) {
      console.log("ERROR - sql-queries.js - sqlQueries.updateRecord(): " + error);
    }
  },


}

module.exports = globalQueries;