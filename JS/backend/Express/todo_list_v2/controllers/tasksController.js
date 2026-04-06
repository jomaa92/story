import pool from '../db.js'


//GET ALL TASKS (API)
export const getAllTasks =  async(req, res)=>{
    try {
        // جلب جميع المهام من قاعدة البيانات وترتيبها تنازلي حسب id
        const result = await pool.query('SELECT * FROM tasks ORDER BY id DESC;')

        // احضار جميع البينات على شكل json
        res.json(result.rows)
        
    } catch (error) {
        // في حال حدوث خطأ
        res.send(error.message)
    }
}

//GET ALL TASKS (EJS)
export const renderTaskPage =  async(req, res)=>{
    try {
        // جلب جميع المهام من قاعدة البيانات وترتيبها تنازلي حسب id
        const result = await pool.query('SELECT * FROM tasks ORDER BY id DESC;')

        // إرسال البيانات إلى صفحة index.ejs
        res.render('index.ejs', {task: result.rows})
        
    } catch (error) {
        // في حال حدوث خطأ
        res.send(error.message)
    }
}

//DELETE
export const deleteTask = async(req, res)=>{
    try {
        const id = req.params.id; // أخذ id من الرابط

        // حذف المهمة من قاعدة البيانات
        await pool.query('DELETE FROM tasks WHERE id=$1',[id])

        // إعادة تحميل الصفحة الرئيسية
        res.redirect('/')

    } catch (error) {
        console.error(error)
    }
}

//CREATE TASK

export const createTask  = async(req, res )=>{
    try {
        // أخذ البيانات من الفورم
        const {title, description, priority} = req.body
        console.log(req.body[0])
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
}


//Change Status task
export const changeStatus  = async (req, res) => {
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
}

//UPDATE TASK
/* export const updateTask  = async(req, res )=>{

    try 
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
} */

