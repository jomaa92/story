/* console.log('Exercise 5.02 - APIs with axios'); */
import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;
app.use(express.static('public'));

let jokeData = '';

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      'https://official-joke-api.appspot.com/jokes/random'
    );
    jokeData = response.data;
    res.send(`<h1>Random Joke</h1>
              <p>${jokeData.setup}</p>
              <p>${jokeData.punchline}</p>`);
  } catch (error) {
    console.error('Error fetching joke:', error);
    res.status(500).send('Error fetching joke');
  }
});

app.set('view engine', 'ejs');

app.get('/ejs', async (req, res) => {
  try {
    const response = await axios.get(
      'https://official-joke-api.appspot.com/jokes/random'
    );
    jokeData = response.data;
    res.render('index.ejs', { joke: jokeData });
  } catch (error) {
    console.error('Error fetching joke:', error);
    res.status(500).send('Error fetching joke');
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
