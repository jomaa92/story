import"dotenv/config"
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
const app = express();
const port = 3000;

console.log(">>_env.password-type: ",typeof(process.env.DB_PASSWORD))
/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password :process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});
/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
db.connect();
/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
// تهيئة المتغيرات
let currentUserId = null;
let users = [];
/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
// دالة للتهيئة
async function initializeApp() {
  try {
        users = await checkUser();

        if (users.length > 0) {
          currentUserId = users[0].id; // تعيين أول مستخدم كافتراضي
        }

        console.log("App initialized with users:", users);

      } catch (error) {
        console.error("Error initializing app:", error);
      }
}

// استدعاء التهيئة
initializeApp();
/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries WHERE user_id = $1",
  [currentUserId]);

  let countries = [];

  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });

  return countries;
}
/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
async function checkUser(){
  const result = await db.query("SELECT * FROM public.users")
  const  users = result.rows

  return users;
}

/* console.log(users) */
/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
async function checkCurrentUser(){
  const result = await db.query("SELECT * FROM public.users")
  const users = result.rows;
  
  return users.find((user) => user.id == currentUserId);
}
/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
app.get("/", async (req, res) => {
  

  const countries = await checkVisisted();
  const user = await checkCurrentUser();

  console.log(user.id)  
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: user.color,
  });
});
/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
app.post("/add", async (req, res) => {
  
  const input = req.body["country"];

  try {
        const result = await db.query(
        "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
        [input.toLowerCase()]
        );

        if (result.rows.length === 0) {
           // 👈 التعامل مع حالة عدم وجود الدولة
            
           return res.status(404).render("index.ejs", {
              countries: await checkVisisted(),
              total: (await checkVisisted()).length,
              users: users,
              color: (await checkCurrentUser()).color,
              error: "Country not found!"
          });
        }

        const data = result.rows[0];
        /* console.log(data) */

        const countryCode = data.country_code;

        try {
              await db.query(
              "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
              [countryCode, currentUserId]
              );

              res.redirect("/");

            } catch (err) {
              console.log(err);
            }
      } catch (err) {
        console.log(err);
      }
});
/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
app.post("/user", async (req, res) => {
  /* console.log(req.body.user) */

  if (req.body.add === "new"){
      res.render("new.ejs")
  }else{
      currentUserId = req.body.user
      res.redirect("/")
}
});
/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
app.post("/new", async (req, res) => {

  try {
        const userColor = req.body.color;
        const name = req.body.name;
        
        const result = await db.query(
        "INSERT INTO users(name,color) VALUES($1,$2) RETURNING id", // 👈 استخدام RETURNING
        [name, userColor]
        );
        
        currentUserId = result.rows[0].id; // 👈 تعيين currentUserId
        users = await checkUser();
        res.redirect("/");

      } catch (error) {
        // ...
      }
});
/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
