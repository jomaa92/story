import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const correctPassword = 'syria'; // ⬅️ عرف المتغير

app.use(express.urlencoded({ extended: true }));

// middleware function
function checkpass(req, res, next) {
  let passwordcheck = req.body.password;
  if (passwordcheck !== correctPassword) {
    return res.status(401).send('Incorrect password'); // ⬅️ ارجع response مباشرة
  }
  next(); // ⬅️ إذا كلمة المرور صحيحة، انتقل للخطوة التالية
}

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.post('/check', checkpass, (req, res) => {
  // ⬅️ استخدم middleware هنا
  let pass = req.body.password;
  res.send(`hallo ${pass}`);
});

app.listen(3000, () => {
  console.log('you listen to the port 3000');
});
