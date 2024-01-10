var connection = require('../db.js');
function createConnection(){
   
  connection.connect((err)=>{
    if(err)console.log(err);
  });

  var createUserTableQuery = `
        CREATE TABLE IF NOT EXISTS cars (
          id INT AUTO_INCREMENT PRIMARY KEY,
          make VARCHAR(255),
          model VARCHAR(255),
          year INT
      );
      `;

    connection.query(createUserTableQuery, function (error) {
      if (error) throw error;
      console.log('SCHEMA CREATED ');
    });
    createUserTableQuery = `create table if not exists carUsers(
      username varchar(100) unique NOT NULL,
      password varchar(20) NOT NULL,
      user_id varchar(100),
      primary key(user_id)
    );`;
    connection.query(createUserTableQuery, function (error) {
      if (error) throw error;
      console.log('SCHEMA CREATED ');
    });
}
module.exports = {createConnection};
