import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',      // غيّرها حسب اسم المستخدم لديك
  host: 'localhost',
  database: 'todo_db',   // قاعدة البيانات التي أنشأناها
  password: '1234',  // ضع كلمة المرور الخاصة بك
  port: 5432,
});

export default pool;