import express from "express";
import db from "./db.js";


const app = express();
const PORT = 3000;


// الاتصال بقاعدة البيانات (مرة واحدة)

async function dataBaseConnect() {
  
  try{
     await db.connect()
     console.log("Database connected successfully")
  }catch(error){
    console.error("Database connection failed:", error.message);
  };  
}

dataBaseConnect()



////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////



// الاتصال بقاعدة البيانات (مرة واحدة)
/* db.connect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  }); */



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
