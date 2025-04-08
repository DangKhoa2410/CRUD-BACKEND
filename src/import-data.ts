import fs from 'fs';
import mysql from 'mysql2/promise';

async function importData() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'crud_db',
  });

  const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));

  for (const user of data.users) {
    await connection.execute(
      'INSERT INTO user (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [user.firstName, user.lastName, user.email, user.password, user.role],
    );
  }

  console.log('Import thành công!');
  await connection.end();
}

importData().catch(console.error);
