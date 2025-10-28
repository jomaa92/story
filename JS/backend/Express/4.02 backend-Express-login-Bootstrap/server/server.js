import e from 'express';
import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const correctPassword = 'asd'; // ⬅️ عرف المتغير
const correctEmail = 'asd@gmail.com';

app.use(express.static(join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

// middleware function
function checkpass(req, res, next) {
  let passwordcheck = req.body.pass;
  let emailcheck = req.body.email;
  if (passwordcheck !== correctPassword || emailcheck !== correctEmail) {
    return res.status(401).send('Incorrect password'); // ⬅️ ارجع response مباشرة
  }
  next(); // ⬅️ إذا كلمة المرور صحيحة، انتقل للخطوة التالية
}

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

app.post('/check', checkpass, (req, res) => {
  // ⬅️ استخدم middleware هنا
  let pass = req.body.pass;
  let email = req.body.email;
  res.send(`hallo your password ist ${pass} and your email ist ${email}`);
});

app.listen(3000, () => {
  console.log('you listen to the port 3000');
});
