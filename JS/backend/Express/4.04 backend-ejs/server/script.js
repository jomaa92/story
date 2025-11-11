import express from 'express';
import ejs from 'ejs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
//////////////////////////////////////////////////////////////////////////////////////
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
///////////////////////////////////////////
app.use(express.urlencoded({ extended: true }));
const PORT = 2000;
//////////////////////////////////////////////////////////////////////////////////////
//console.log('first test');
//console.log(express());
//////////////////////////////////////////////////////////////////////////////////////
// **أضف هذا الجزء:**
app.set('view engine', 'ejs');
// يخبر Express أن تبحث عن ملفات EJS في مجلد 'views' الموازي لملف السيرفر
app.set('views', join(__dirname, '..', 'views'));
//////////////////////////////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
  // استخدم اسم الملف فقط
  res.render('home');
});

app.get('/contact', (req, res) => {
  // 2. تمرير بيانات (مثل name) ليتجنب الخطأ في قالب contact.ejs
  res.render('contact', { name: 'Visitor' });
});
app.post('/contact', (req, res) => {
  // **هذا هو الصحيح:** req.body.name للوصول إلى حقل الإدخال باسم "name"
  const submittedName = req.body.name || 'Anonymous'; // استخدم قيمة افتراضية في حالة عدم وجودها

  res.render('contact', { name: submittedName });
});

app.listen(PORT, () => {
  console.log('you listen to port ****');
});
//////////////////////////////////////////////////////////////////////////////////////
