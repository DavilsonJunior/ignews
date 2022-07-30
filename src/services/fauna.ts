import { Client } from 'faunadb';

export const fauna = new Client({
  secret: process.env.FAUNADB_KEY,
  // scheme: "http",
  // domain: "localhost",
  // port: 8443,
})