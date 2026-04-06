// استيراد المكتبات
import express from 'express';      // إطار عمل لإنشاء السيرفر
import tasksRoutes from './routers/tasksRoutes.js'

// إنشاء التطبيق
const app = express();
const PORT = 3001; // رقم البورت

// إعدادات الـ view engine (EJS)
app.set('view engine', 'ejs');      // استخدام EJS لعرض الصفحات
app.set('views','./views');         // تحديد مجلد الـ views

// Middleware
app.use(express.urlencoded({extended:true})) // لقراءة البيانات من الفورم
app.use(express.static('public'))            // لتقديم الملفات الثابتة (CSS, JS)
app.use(express.json())

// routes
app.use('/',tasksRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});