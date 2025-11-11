const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const dirname = require("path")
// const fileUrlToPathe = require("url")

const path = require('path');
// console.log(path.join(__dirname, 'Veiws'));
// console.log(path.resolve(__dirname, 'views'));
// const _dirname = path.dirname(__filename);
// console.log(__dirname);

let userIsAuthorised = false;

const os = require('os');
console.log('dir:', os.homedir(), '|', 'host:', os.hostname());

app.use(bodyParser.urlencoded({ extended: true }));

let pass = function passwordChech(req, res, next) {
  console.log(req.body);
  let password = req.body['password'];
  console.log(password);

  if (password === 'iloveyou') {
    userIsAuthorised = true;
  } else {
    userIsAuthorised = false;
  }
  next();
};
// console.log(passwordChech);
app.use(pass);

// GET request for "/"
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Views/index.html'); // Send a simple response
});

// POST request for "/user" with optional body data
app.post('/do', (req, res) => {
  if (userIsAuthorised) {
    res.sendFile(__dirname + '/Views/home.html');
  } else {
    res.sendFile(__dirname + '/Views/404.html');
  }
});

// Listen on port 4000
app.listen(4041, () => {
  console.log('Server listening on port 4041');
});
