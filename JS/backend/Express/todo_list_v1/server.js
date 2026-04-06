// استيراد المكتبات
import express from 'express';      // إطار عمل لإنشاء السيرفر
import pool from './db.js';         // الاتصال بقاعدة البيانات (PostgreSQL)

// إنشاء التطبيق
const app = express();
const PORT = 3000; // رقم البورت

// إعدادات الـ view engine (EJS)
app.set('view engine', 'ejs');      // استخدام EJS لعرض الصفحات
app.set('views','./views');         // تحديد مجلد الـ views

// Middleware
app.use(express.urlencoded({extended:true})) // لقراءة البيانات من الفورم
app.use(express.static('public'))            // لتقديم الملفات الثابتة (CSS, JS)

// =======================
// GET: عرض جميع المهام
// =======================
app.get('/', async(req, res)=>{
    try {
        // جلب جميع المهام من قاعدة البيانات وترتيبها تنازلي حسب id
        const result = await pool.query('SELECT * FROM tasks ORDER BY id DESC;')

        // إرسال البيانات إلى صفحة index.ejs
        res.render('index.ejs', {task: result.rows})
        
    } catch (error) {
        // في حال حدوث خطأ
        res.send(error.message)
    }
});

// =======================
// POST: حذف مهمة
// =======================
app.post('/delete/:id', async(req, res)=>{
    try {
        const id = req.params.id; // أخذ id من الرابط

        // حذف المهمة من قاعدة البيانات
        await pool.query('DELETE FROM tasks WHERE id=$1',[id])

        // إعادة تحميل الصفحة الرئيسية
        res.redirect('/')

    } catch (error) {
        console.error(error)
    }
});

// =======================
// POST: إضافة مهمة جديدة
// =======================
app.post("/add", async(req, res )=>{
    try {
        // أخذ البيانات من الفورم
        const {title, description, priority} = req.body

        // إدخال البيانات في قاعدة البيانات
        await pool.query(
            'INSERT INTO tasks(title, description, priority) VALUES($1, $2, $3)',
            [title, description, priority]
        )

        // الرجوع للصفحة الرئيسية
        res.redirect("/")

    } catch (error) {
        console.error(error)
    }
});

// =======================
// POST: تغيير حالة المهمة (done / pending)
// =======================
app.post('/done/:id', async (req, res) => {
  const id = req.params.id; // أخذ id

  // 1. جلب الحالة الحالية للمهمة
  const result = await pool.query(
    'SELECT status FROM tasks WHERE id = $1',
    [id]
  );

  // إزالة الفراغات (مهم إذا النوع CHAR)
  const currentStatus = result.rows[0].status.trim();

  // 2. عكس الحالة (toggle)
  const newStatus = currentStatus === 'pending' ? 'done' : 'pending';

  // 3. تحديث الحالة في قاعدة البيانات
  await pool.query(
    'UPDATE tasks SET status = $1 WHERE id = $2',
    [newStatus, id]
  );

  // إعادة تحميل الصفحة
  res.redirect('/');
});

/*
💡 ملاحظة:
تقدر تختصر الخطوات الثلاثة باستعلام SQL واحد فقط:

await pool.query(`
  UPDATE tasks
  SET status = CASE
    WHEN status = 'pending' THEN 'done'
    ELSE 'pending'
  END
  WHERE id = $1
`, [id]);
*/

// =======================
// تشغيل السيرفر
// =======================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});