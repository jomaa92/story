import"dotenv/config"
import express from "express";
import pg from "pg";
import axios from "axios";

const db = new pg.Client({
   user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database:process.env.DB_NAME,
    password :process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
});

db.connect();

const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

/* app.get("/", async (req, res) => {
  try {
    let sortOption = req.query.sort;
    let orderBy = "id DESC"; // ترتيب افتراضي

    if (sortOption === "rating") {
      orderBy = "rating DESC";
    } else if (sortOption === "date") {
      orderBy = "date_read DESC";
    } else if (sortOption === "title") {
      orderBy = "title ASC";
    }

    const result = await db.query(`SELECT * FROM books ORDER BY ${orderBy}`);

    res.render("index", { books: result.rows });
  } catch (err) {
    console.log(err);
    res.send("Error loading books");
  }
}); */

app.get("/", async (req, res) => {
  try {
    let sortOption = req.query.sort;
    let search = req.query.search;

    let orderBy = "id DESC";

    if (sortOption === "rating") {
      orderBy = "rating DESC";
    } else if (sortOption === "date") {
      orderBy = "date_read DESC";
    } else if (sortOption === "title") {
      orderBy = "title ASC";
    }

    let query = `SELECT * FROM books`;
    let values = [];

    if (search) {
      query += ` WHERE title ILIKE $1 OR author ILIKE $1`;
      values.push(`%${search}%`);
    }

    query += ` ORDER BY ${orderBy}`;

    const result = await db.query(query, values);

    res.render("index", { books: result.rows, search });
  } catch (err) {
    console.log(err);
    res.send("Error loading books");
  }
});

/* app.get("/search", async (req, res) => {
  try {
    const query = req.query.query;

    const result = await db.query(
      `SELECT * FROM books 
       WHERE title ILIKE $1 OR author ILIKE $1
       ORDER BY id DESC`,
      [`%${query}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Search error" });
  }
}); */

app.get("/search", async (req, res) => {
  try {
    const query = req.query.query;

    const result = await db.query(
      `SELECT * FROM books 
       WHERE title ILIKE $1 OR author ILIKE $1
       ORDER BY id DESC`,
      [`%${query}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Search error" });
  }
});

app.post("/add", async (req, res) => {
  try {
    let { title, author, rating, review, date_read, isbn } = req.body;

    if (isbn && !title) {
      const response = await axios.get(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
      );

      const bookData = response.data[`ISBN:${isbn}`];

      if (!bookData) {
        return res.send("Book not found with this ISBN");
      }

      title = bookData.title;

      if (bookData.authors && bookData.authors.length > 0) {
        author = bookData.authors[0].name;
      }
    }
    rating = rating ? parseInt(rating) : null;
    date_read = date_read ? date_read : null;
    await db.query(
      "INSERT INTO books (title, author, rating, review, date_read, isbn) VALUES ($1, $2, $3, $4, $5, $6)",
      [title, author, rating, review, date_read, isbn]
    );

    res.redirect("/");
  } catch (err) {
    console.log(err.message);
    res.send("Error fetching book data");
  }
});

/* app.post("/add", async (req, res) => {
  try {
    const { title, author, rating, review, date_read, isbn } = req.body;

    await db.query(
      "INSERT INTO books (title, author, rating, review, date_read, isbn) VALUES ($1, $2, $3, $4, $5, $6)",
      [title, author, rating, review, date_read, isbn]
    );

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("Error inserting book");
  }
}); */


app.post("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await db.query("DELETE FROM books WHERE id = $1", [id]);

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("Error deleting book");
  }
});

app.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await db.query(
      "SELECT * FROM books WHERE id = $1",
      [id]
    );

    res.render("edit", { book: result.rows[0] });

  } catch (err) {
    console.log(err);
    res.send("Error loading edit page");
  }
});

app.post("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let { title, author, rating, review, date_read, isbn } = req.body;

    /* console.log(rating) // 5 
    console.log(typeof(rating)) // String "5" */

    rating = rating ? parseInt(rating) : null;
    date_read = date_read ? date_read : null;

    await db.query(
      `UPDATE books 
       SET title=$1, author=$2, rating=$3, review=$4, date_read=$5, isbn=$6
       WHERE id=$7`,
      [title, author, rating, review, date_read, isbn, id]
    );

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("Error updating book");
  }
});

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/* let input = document.getElementById("searchInput");
let resultsDiv = document.getElementById("results");

input.addEventListener("keyup", async () => {
  const query = input.value;

  if (query.length === 0) {
    resultsDiv.innerHTML = "";
    return;
  }

  try {
    const response = await axios.get(`/search?query=${query}`);
    const books = response.data;

    resultsDiv.innerHTML = "";

    books.forEach(book => {
      resultsDiv.innerHTML += `
        <div>
          <h3>${book.title}</h3>
          <p>${book.author}</p>
          <p>⭐ ${book.rating || "No rating"}</p>
          <hr>
        </div>
      `;
    });

  } catch (error) {
    console.log(error);
  }
}); */

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/* 

app.get("/", async(req, res) => {
    
    
    const result = await db.query("SELECT * FROM books")
    console.log(result.rows)
  res.send(
  "Server is working 🚀<br><pre>" +
  JSON.stringify(result.rows, null, 2) +
  "</pre>"
);

}); */
/*   const result = await db.query(
        "INSERT INTO books (title, author, rating, review, date_read) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        ["My Book", "Author Name", 5, "Great book!", "2026-02-24"]
    )   ;
    console.log(result.rows); */
/* app.post("/add", async (req, res) => {
  try {
    const { title, author, rating, review, date_read } = req.body;

    const result = await db.query(
      "INSERT INTO books (title, author, rating, review, date_read) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, author, rating, review, date_read]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.send("Error inserting book");
  }
}); */

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});