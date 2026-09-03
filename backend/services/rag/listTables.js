require('dotenv').config();
const { Client } = require('pg');

async function listAllTables() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("❌ Missing DATABASE_URL in .env!");
    console.error("Please add your 'direct string' (Connection string) to the .env file like this:");
    console.error("DATABASE_URL=postgresql://postgres.xxx:password@aws-xxx.pooler.supabase.com:6543/postgres");
    return;
  }

  const client = new Client({
    connectionString: connectionString,
  });

  try {
    console.log("Connecting to PostgreSQL...");
    await client.connect();

    // Query to get all user-created tables in the 'public' schema
    const query = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    const res = await client.query(query);

    console.log("\n===============================");
    console.log(`✅ Total Tables Found: ${res.rows.length}`);
    console.log("===============================");
    
    res.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });
    console.log("===============================\n");

  } catch (error) {
    console.error("❌ Error fetching tables:", error.message);
  } finally {
    await client.end();
  }
}

listAllTables();
