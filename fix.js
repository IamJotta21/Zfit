const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) results = results.concat(walk(file));
    else results.push(file);
  });
  return results;
}
const files = walk('src/app/api').filter(f => f.endsWith('.js'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('new PrismaClient(')) {
    content = content.replace(/import { PrismaClient } from "@prisma\/client";/, 'import { PrismaClient } from "@prisma/client";\nimport { Pool } from "pg";\nimport { PrismaPg } from "@prisma/adapter-pg";');
    content = content.replace(/const prisma = new PrismaClient\([^)]*\);/g, 'const pool = new Pool({ connectionString: process.env.DATABASE_URL });\nconst adapter = new PrismaPg(pool);\nconst prisma = new PrismaClient({ adapter });');
    fs.writeFileSync(file, content);
  }
});
