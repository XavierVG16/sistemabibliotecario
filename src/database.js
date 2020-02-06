const mysql = require('mysql');
const { promisify }= require('util');

const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Laconexion con al base de datos fue cerrada.');
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has to many connections');
      }
      if (err.code === 'ECONNREFUSED') {
        console.error('Corexion rechasada');
      }
    }
  
   if (connection) connection.release();
    console.log('DB esta conectado');
  
    return;
  });
  

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;
