const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

const init = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY,
      ts TIMESTAMP DEFAULT NOW()
    );
  `);
};

app.get('/ping', (_req,res)=>res.json({ok:true,svc:'node',ts:Date.now()}));
app.get('/health', (_req,res)=>res.json({ok:true}));
app.post('/hit', async (_req,res)=>{
  try{ await pool.query('INSERT INTO visits DEFAULT VALUES'); res.json({ok:true}); }
  catch(e){ res.status(500).json({ok:false,error:e.message}); }
});
app.get('/count', async (_req,res)=>{
  try{ const r = await pool.query('SELECT COUNT(*)::int AS count FROM visits'); res.json({count:r.rows[0].count}); }
  catch(e){ res.status(500).json({ok:false,error:e.message}); }
});

init().then(()=>{
  app.listen(process.env.PORT||3000, ()=>console.log('node ready'));
}).catch(e=>{console.error(e);setTimeout(()=>process.exit(1),1000)});
