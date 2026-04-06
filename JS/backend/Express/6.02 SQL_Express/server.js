import express from "express";
import pg from "pg";


const app = express();
const PORT = 3000;

// إعداد الاتصال بقاعدة البيانات
const db = new pg.Client({
    user:"app_user",
    host:"localhost",
    database:"postgres",
    password:"yarevS1992@",
    port:5432,
});

// الاتصال بقاعدة البيانات (مرة واحدة)
db.connect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

// Route
app.get("/capitals", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM capitals");

    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.json({ message: "No data found" });
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
