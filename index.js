"use strict";

const Hapi = require("@hapi/hapi");

const { Pool } = require("pg");

const init = async () => {
  // Hapi
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  const connectionString =
    "postgres://bvsrytyi:GwGglZPc3-J_WYVYSSdtixGL02MvIYPz@arjuna.db.elephantsql.com:5432/bvsrytyi";
  const pool = new Pool({
    connectionString: connectionString,
  });

  server.route({
    method: "POST",
    path: "/tables",
    handler: async (request, h) => {
      const client = await pool.connect();
      const payload = request.payload;
      try {
        const tableName = payload.name;

        const insertTableQuery = `INSERT INTO tables (name) VALUE ('${tableName}');`;
        const insertTableQueryResponse = await client.query(insertTableQuery);
        return h.response(insertTableQueryResponse);
      } catch (e) {
        console.error(e.message);
      } finally {
        client.release();
      }
    },
  });

  server.route({
    method: "POST",
    path: "/entity",
    handler: async (request, h) => {
      const client = await pool.connect();
      const payload = request.payload;
      try {
        const tableName = payload.name;
        const createTableQuery = `CREATE TABLE ${tableName}(
            id serial PRIMARY KEY,
            created_on TIMESTAMP NOT NULL,
            modified_on TIMESTAMP NOT NULL
          );`;
        const createTableQueryResponse = await client.query(createTableQuery);
        return h.response(createTableQueryResponse);
      } catch (e) {
        console.log(e);
      } finally {
        client.release();
      }
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
