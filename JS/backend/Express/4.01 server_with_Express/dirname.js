const express = require('express');
const app = express();

const PORT = 4444;
app.use(express.urlencoded({ extended: true }));

app.use(function checkpass(req, res, next) {
  console.log(req.body);
  const password = req.body['password'];
  console.log(password);
  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Views/index.html');
});

app.post('/do', (req, res) => {
  res.send(req.body);
});

app.listen(PORT, () => {
  console.log('it is connect on your serv...');
});
