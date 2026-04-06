# Async/Await + Try/Catch – أمثلة واقعية كاملة

هذا الملف يوضح **كيفية كتابة كود async بأمان وفعالية** في Node.js مع إدارة الأخطاء، بحيث تتجنب race conditions، وتتأكد من التعامل مع النتائج بشكل صحيح.

---

## 1️⃣ استخدام await داخل دالة async

```js
async function getUsers() {
  try {
    const result = await db.query("SELECT * FROM users");
    return result.rows; // ربط المنطق مباشرة بالنتيجة
  } catch (err) {
    console.error("DB query failed", err);
    throw err; // إعادة الخطأ للطبقات الأعلى إذا لزم الأمر
  }
}

// استخدام الدالة
getUsers()
  .then(users => console.log("Users fetched:", users))
  .catch(err => console.log("Error caught in main flow:", err));
```

✅ مزايا:
- لا race condition
- الأخطاء يتم التعامل معها
- يمكن استخدام النتيجة مباشرة بعد Promise

---

## 2️⃣ استخدام async/await في Express route

```js
app.get('/users', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("DB query failed", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
```

✅ مزايا:
- المخرجات دائمًا دقيقة
- الأخطاء يتم التعامل معها فورًا
- لا يوجد race condition بين إرسال الاستجابة وقراءة البيانات

---

## 3️⃣ تجنب race conditions عند عدة عمليات async

```js
async function getDashboardData() {
  try {
    const [users, orders, products] = await Promise.all([
      db.query("SELECT * FROM users"),
      db.query("SELECT * FROM orders"),
      db.query("SELECT * FROM products")
    ]);

    return { users: users.rows, orders: orders.rows, products: products.rows };
  } catch (err) {
    console.error("Failed fetching dashboard data", err);
    throw err;
  }
}

getDashboardData()
  .then(data => console.log("Dashboard data:", data))
  .catch(err => console.log("Error:", err));
```

✅ مزايا:
- تنفيذ متوازي لعمليات I/O
- إدارة أخطاء مركّزة
- جميع النتائج متاحة قبل المتابعة

---

## 4️⃣ التعامل مع Microtask / Macrotask داخل async

```js
async function complexFlow() {
  console.log("Start");

  setTimeout(() => console.log("Macrotask"), 0);

  await Promise.resolve(); // Microtask
  console.log("After await / Microtask");

  console.log("End of function");
}

complexFlow();
```

✅ مزايا:
- فهم ترتيب التنفيذ
- لا تتأثر async bugs بالـ timing
- يمكن دمج await مع setTimeout بوعي كامل

---

## 🔹 الخلاصة

- **ربط المنطق مباشرة بالنتيجة**: لا تعتمد على متغيرات خارجية قبل اكتمال async.  
- **try/catch** أو **.catch()** ضروري دائمًا للتعامل مع الأخطاء.  
- **await داخل دالة async** فقط.  
- استخدم **Promise.all** للتنفيذ المتوازي الآمن.  
- فهم ترتيب Microtask / Macrotask مهم عند دمج setTimeout و Promise و await.  

📘 هذا نموذج عملي جاهز لجميع سيناريوهات async code في Node.js. يمكنك استخدامه كأساس لأي مشروع حقيقي.

