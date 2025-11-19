import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
const __dirname = dirname(fileURLToPath(import.meta.url));

// ✅ الحل 2: تهيئة مجلد public لتقديم الملفات الثابتة (مثل CSS)
app.use(express.static(join(__dirname, 'public')));

// ✅ MUST BE ACTIVE: إعادة تفعيل إعدادات EJS
app.set('view engine', 'ejs');

app.set('views', join(__dirname, '.', 'views'));
app.set('public', join(__dirname, '.', 'public'));

console.log(join(__dirname, '.', 'views'));

app.get('/', (req, res) => {
  // ✅ الحل 1 و 3: تمرير جميع المتغيرات المطلوبة في قالب EJS بقيم مبدئية
  res.render('index', {
    fName: '',
    lName: '',
    result: 0,
  });
});

app.post('/submit', (req, res) => {
  // التحقق من وجود الحقول لتجنب أخطاء null/undefined
  const nameLength = req.body.fName ? req.body.fName.length : 0;
  const lastNameLength = req.body.lName ? req.body.lName.length : 0;

  const calculatedResult = nameLength + lastNameLength;
  console.log('Total letters:', calculatedResult);

  // ✅ تصحيح اسم المتغير إلى 'result' ليتطابق مع EJS
  // ونمرر الاسم الأول والأخير مرة أخرى لملء حقول الإدخال
  res.render('index', {
    fName: req.body.fName || '',
    lName: req.body.lName || '',
    result: calculatedResult,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
