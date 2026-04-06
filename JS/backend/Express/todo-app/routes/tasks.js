import express from 'express';
import pool from '../db.js';

const router = express.Router();

// عرض جميع المهام
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.render('index', { tasks: result.rows });
  } catch (err) {
    console.error(err);
    res.send('حدث خطأ أثناء جلب المهام');
  }
});

// إضافة مهمة جديدة
router.post('/add', async (req, res) => {
  const { title, description, priority, due_date } = req.body;
  try {
    await pool.query(
      'INSERT INTO tasks (title, description, priority, due_date) VALUES ($1, $2, $3, $4)',
      [title, description, priority, due_date]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('حدث خطأ أثناء إضافة المهمة');
  }
});

// حذف مهمة 
router.post("/delete/:id", async(req, res)=>{
  const id = req.params.id;

  try {
    await pool.query('DELETE FROM tasks WHERE id=$1',[id]);
    res.redirect('/');


  } catch (error) {
    console.error(error);
    res.send('حدث خطاء اثناء الحذف')
  }

})
// اكتملت المهمة او لم تكتمل
router.post('/toggle/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query(
      'UPDATE tasks SET completed = NOT completed WHERE id = $1',
      [id]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('حدث خطأ أثناء تحديث المهمة');
  }
});

//تعديل المهمة _ جلب البينات
router.get('/edit/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    const task = result.rows[0];

    res.render('edit', { task });
  } catch (err) {
    console.error(err);
    res.send('خطأ في تحميل صفحة التعديل');
  }
});

// تعديل المهمة حفظ البينات في ملف 
// edit.ejs
router.post('/edit/:id', async (req, res) => {
  const id = req.params.id;
  const { title, description, priority, due_date } = req.body;

  try {
    await pool.query(
      `UPDATE tasks 
       SET title = $1, description = $2, priority = $3, due_date = $4
       WHERE id = $5`,
      [title, description, priority, due_date, id]
    );

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('خطأ أثناء تحديث المهمة');
  }
});
export default router;