import http from 'http';
import https from 'https';

import express from 'express';

const app = express();

app.get('/', (req, res) => {
  const options = {
    hostname: 'bored-api.appbrewery.com',
    path: '/random',
    method: 'GET',
  };

  const request = https.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      // ⚠️ تأكد من أن الحالة هي 200 قبل التحليل
      /*  if (response.statusCode !== 200) {
        console.error(
          `API Error: Status Code ${response.statusCode}. Raw Data: ${data}`
        );
        return res
          .status(response.statusCode)
          .send(`API returned status code ${response.statusCode}.`);
      } */

      try {
        // 👈🏼 إلغاء تعليق: تعريف المتغير وتحليل البيانات
        const parsedData = JSON.parse(data);

        console.log('Response (in Terminal):', parsedData);

        // 👈🏼 إلغاء تعليق: إرسال الاستجابة بنجاح
        res.send(parsedData);
      } catch (e) {
        // يتم تفعيل هذا فقط إذا فشل تحليل JSON
        console.error('Error parsing JSON:', e);
        res.status(500).send('Error processing API data');
      }
    });

    /*  response.on('end', () => {
      const parsedData = JSON.parse(data);
      console.log('Response:', parsedData); */

    // هذا هو النص الذي ستراه في المتصفح
    /* res.send('Check console for response data'); */

    // 👇🏼 تغيير هنا لإرسال بيانات JSON إلى المتصفح
    /*   res.json(parsedData);
    }); */
  });

  request.on('error', (error) => {
    console.error('Error:', error);
    res.status(500).send('Error occurred while making the request');
  });

  request.end();
});

// 👈🏼 هذا الجزء أساسي لتشغيل الخادم
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

////////////////////////////////////////////////////////////

// Basic Express Server Setup

////////////////////////////////////////////////////////////

/* app.get('/', (req, res) => {

res.send('Hello World!');

});


const server = http.createServer(app);


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

console.log(`Server is running on port ${PORT}`);

});

*/

////////////////////////////////////////////////////////////

// Express APIs

////////////////////////////////////////////////////////////

/* import express from 'express';


const app = express();


// Middleware to parse JSON bodies

app.use(express.json());


// Sample in-memory data

let items = [

{ id: 1, name: 'Item One' },

{ id: 2, name: 'Item Two' },

];


// GET all items

app.get('/api/items', (req, res) => {

res.json(items);

});


// GET item by ID

app.get('/api/items/:id', (req, res) => {

const item = items.find(i => i.id === parseInt(req.params.id));

if (item) {

res.json(item);

} else {

res.status(404).send('Item not found');

}

});


// POST a new item

app.post('/api/items', (req, res) => {

const newItem = {

id: items.length + 1,

name: req.body.name,

};

items.push(newItem);

res.status(201).json(newItem);

});


// PUT update an item

app.put('/api/items/:id', (req, res) => {

const item = items.find(i => i.id === parseInt(req.params.id));

if (item) {

item.name = req.body.name;

res.json(item);

} else {

res.status(404).send('Item not found');

}

});


// DELETE an item

app.delete('/api/items/:id', (req, res) => {

items = items.filter(i => i.id !== parseInt(req.params.id));

res.status(204).send();

});


// Start the server

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

console.log(`Server is running on port ${PORT}`);

}); */
