import express from "express";
import pg, { Query } from "pg";
import bodyParser from "body-parser";

const app = express();
const port = 3000;



const db = new pg.Client ({

    user:"app_user",
    host:"localhost",
    database:"postgres",
    password:"yarevS1992@",
    port:5432,

});

db.connect();
// نقوم بتغيير تعريف quiz ليقبل التعديل
let quiz = []; 

async function quizs() {
  try {
    let results = await db.query("SELECT * FROM capitals");
    quiz = results.rows; // إسناد البيانات مباشرة
    return quiz; 
  } catch (error) {
    console.log(error.message);
  } finally {
    // نغلق الاتصال هنا لضمان حدوث ذلك سواء نجح الكود أو فشل
    await db.end();
    console.log("Database connection closed.");
  }
}

// استخدام await عند الاستدعاء
await quizs(); 

/* console.log("here Data:", quiz); // الآن ستظهر البيانات بشكل صحيح */

/* let quiz = [
  { country: "France", capital: "Paris" },
  { country: "United Kingdom", capital: "London" },
  { country: "United States of America", capital: "New York" },
]; */

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];

  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
