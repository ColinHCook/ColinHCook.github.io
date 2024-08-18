const { Client } = require("pg");
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // This ensures SSL is used without rejecting self-signed certificates
  },
});

client.connect();

client.query("SET search_path TO public;", (err, res) => {
  if (err) {
    console.error("Error setting search path:", err.stack);
  } else {
    console.log("Search path set to public");
  }
});
