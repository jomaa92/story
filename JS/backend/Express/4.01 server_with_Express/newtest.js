const express = require('express');
const app = express();
console.log('server on ');

app.use(express.urlencoded({ extended: true }));

app.use(function checkPassName(req, res, next) {
  let pass = req.body['passwoed'];
  console.log(pass);
  if (pass === 'asd') {
    console.log('gut');
  } else {
    console.log('not good');
  }

  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Views/index.html');
  console.log('it is get');
});

// app.put((res, req) => {
//   const bodymass = req.body;
// });
const port = 3333;
app.listen(port, () => {
  console.log('THE SERVER LISTEN ON PORT');
});
