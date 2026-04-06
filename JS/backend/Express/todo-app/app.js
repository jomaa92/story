import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import tasksRouter from './routes/tasks.js';

const app = express();
const PORT = 3000;

// لتحديد المسارات الصحيحة مع ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// إعدادات EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// إعداد ملفات public
app.use(express.static(path.join(__dirname, 'public')));

// body-parser لقراءة بيانات POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// استخدام المسارات
app.use('/', tasksRouter);

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});