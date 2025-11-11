import express from 'express';
import ejs from 'ejs';
import { dirname } from 'path';
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
app.get('/', (req, res) => {
  console.log(req.body);
  res.sendFile(__dirname + '../views/home.ejs');
});

/* app.get('/contact', (req, res) => {
  console.log(req.body);
  res.render();
}); */

app.listen(PORT, () => {
  console.log('you listen to port ****');
});
//////////////////////////////////////////////////////////////////////////////////////
