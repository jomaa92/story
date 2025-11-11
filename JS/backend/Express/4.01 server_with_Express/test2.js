const express = require('express');
const fs = require('fs');
const app = express();

let passTrue = false;
app.use(express.urlencoded({ extended: true }));

let checkPass = function (res, req, next) {
  let pass = res.body['password'];
  console.log(pass);
  if (pass === 'iamtheKing') {
    passTrue = true;
  } else {
    passTrue = false;
  }
  next();
};
app.use(checkPass);

app.post('/do', (req, res) => {
  if (passTrue) {
    res.sendFile(__dirname + '/Views/home.html');
  } else {
    res.sendFile(__dirname + '/Views/404.html');
  }
  //   res.send(req.body);
});
// app.get('/', (res, req) => {
//   fs.sendFile(__dirname + '/Views/style.css', error => {});
//   req.sendFile(__dirname + '/Views/index.html');
// });
const port = 4444;
app.listen(port, () => {
  console.log('the server it is work of port****');
});
