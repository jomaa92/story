import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';
import ejs from 'ejs';





const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/* console.log(__dirname); */
const DATA_FILE = path.join(__dirname, 'jokes.json');
/* console.log(DATA_FILE); */


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Read data from JSON file
function readData() {
    try {
    const  data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);        
}
    catch (error) {
        console.error('Error reading data:', error);
        return [];
    }
};
/* console.log(readData()); */

// Get all items
app.get('/jokes', (req, res) => {
    const data = readData();
    res.json(data.jokes);
});

// Get item by ID
app.get('/jokes/:id', (req, res) => {
     const datas = readData();
    const jokes = datas.jokes;
    const joke = jokes.find(j=> j.id === parseInt(req.params.id));
    if (joke) {
        res.json(joke);
    } else {
        res.status(404).json({ message: 'Joke not found' });
    }
});

app.post('/jokes', (req, res) => {
    const datas = readData();
    const jokes = datas.jokes;
    const newJoke = {
        id: jokes.length ? jokes[jokes.length - 1].id + 1 : 1,
        joke: req.body.joke || 'No joke provided'
    };
    jokes.push(newJoke);
    fs.writeFileSync(DATA_FILE, JSON.stringify(datas, null, 2));
    res.status(201).json(newJoke);
}); 


// Start the server 
app.get('/jokes/filter/:categorys', (req, res) => {
    const datas = readData();
    const jokes = datas.jokes;
    const category = req.params.categorys.toLowerCase();
    const filteredJokes = jokes.filter(j => j.joke.toLowerCase().includes(category));
    res.json(filteredJokes);
})

app.delete('/jokes/:id', (req, res) => {
    const datas = readData();
    const jokes = datas.jokes;
    const jokeIndex = jokes.findIndex(j => j.id === parseInt(req.params.id));
    if (jokeIndex !== -1) {
        const deletedJoke = jokes.splice(jokeIndex, 1)[0];
        fs.writeFileSync(DATA_FILE, JSON.stringify(datas, null, 2));
        res.json(deletedJoke);
    } else {
        res.status(404).json({ message: 'Joke not found' });
    }      
});

app.put('/jokes/:id', (req, res) => {
    const datas = readData();
    const jokes = datas.jokes;
    const joke = jokes.find(j => j.id === parseInt(req.params.id));
    if (joke) {
        joke.joke = req.body.joke || joke.joke;
        fs.writeFileSync(DATA_FILE, JSON.stringify(datas, null, 2));
        res.json(joke);
    } else {
        res.status(404).json({ message: 'Joke not found' });
    }
});

app.patch('/jokes/:id', (req, res) => {
    const datas = readData();
    const jokes = datas.jokes;

    const joke = jokes.find(j => j.id === parseInt(req.params.id));
    if (joke) {
        if (req.body.joke) {
            joke.joke = req.body.joke;
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(datas, null, 2));
        res.json(joke);
    } else {
        res.status(404).json({ message: 'Joke not found' });
    }
}); 


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
