# 🃏 Jokes API

A simple RESTful API for managing jokes using **Node.js + Express**, with data stored in a JSON file.

---

## 🚀 Getting Started

### Requirements
- Node.js (v16 or later)
- npm

### Install dependencies
```bash
npm install
```

### Start the server
```bash
node index.js
```

📍 The server will run at:
```
http://localhost:3000
```

---

## 📁 Data Structure (JSON)

All data is stored in `jokes.json` using the following structure:

```json
{
  "metadata": {},
  "jokes": [
    {
      "id": 1,
      "joke": "Example joke"
    }
  ],
  "statistics": {}
}
```

⚠️ **Important:**  
All API operations modify only the `jokes` array and preserve the rest of the object.

---

## 📌 API Endpoints

### 🔹 GET /jokes
Returns all jokes.

**Response:**
```json
[
  { "id": 1, "joke": "Example joke" }
]
```

---

### 🔹 GET /jokes/:id
Returns a single joke by ID.

**Example:**
```
/jokes/1
```

---

### 🔹 POST /jokes
Add a new joke.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "joke": "This is a new joke 😄"
}
```

**Response (201):**
```json
{
  "id": 2,
  "joke": "This is a new joke 😄"
}
```

---

### 🔹 PUT /jokes/:id
Update a joke completely.

**Body:**
```json
{
  "joke": "Updated joke"
}
```

---

### 🔹 PATCH /jokes/:id
Update a joke partially.

**Body:**
```json
{
  "joke": "Partially updated joke"
}
```

---

### 🔹 DELETE /jokes/:id
Delete a joke by ID.

---

### 🔹 GET /jokes/filter/:keyword
Search jokes by keyword.

**Example:**
```
/jokes/filter/doctor
```

---

## 🧪 Testing the API

You can test the API using:
- **Postman**
- **Thunder Client (VS Code)**

Make sure to send:
```
Content-Type: application/json
```

---

## ⚠️ Notes
- This project is for learning purposes
- Uses file-based storage (no database)
- Not suitable for production use

---

## 🧠 Possible Improvements
- Input validation
- Database integration (MongoDB / SQLite)
- Authentication
- Pagination and sorting
- Swagger / OpenAPI documentation

---

## 📜 License
Educational use only.
