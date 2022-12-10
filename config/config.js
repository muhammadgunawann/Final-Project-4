require("dotenv").config();


module.exports = {
    "development": {
      "username": "ahmad",
      "password": "password",
      "database": "db_MyGram",
      "host": "127.0.0.1",
      "dialect": "postgres"
    },
    "test": {
      "username": "ahmad",
      "password": "password",
      "database": "db_MyGram_test",
      "host": "127.0.0.1",
      "dialect": "postgres"
    },
    "production": {
      "username": process.env.PGUSER,
      "password": process.env.PGPASSWORD,
      "database": process.env.PGDATABASE,
      "host": process.env.PGHOST,
      "port": process.env.PGPORT,
      "dialect": "postgres"
    }
}
  