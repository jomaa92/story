# Async Code – Professional Checklist

هذا الملف يجمع **كل القواعد الأساسية للمحترفين** قبل كتابة أي كود asynchronous في JavaScript / Node.js، مع أمثلة عملية لكل نقطة.

---

## 1️⃣ تحديد طبيعة العملية
- [ ] حدد إذا كانت العملية **I/O** (DB, API, file) أو عملية **حسابية سريعة**
- [ ] قرر ما إذا كنت ستستخدم `Promise` أو `async/await`

```js
// I/O → async/await
const users = await db.query("SELECT * FROM users");

// حساب سريع → synchronous
const total = items.reduce((a,b)=>a+b,0);
```

---

## 2️⃣ التعامل مع النتائج
- [ ] اربط كل منطق يعتمد على النتيجة داخل then/await
- [ ] تجنّب استخدام متغير خارجي قبل اكتمال العملية

```js
// ❌ race condition
let cache;
db.query("SELECT * FROM users").then(res => cache = res.rows);
if (cache) console.log("Using cache");

// ✅ ربط مباشر بالنتيجة
const users = await db.query("SELECT * FROM users");
console.log("Using cache");
```

---

## 3️⃣ إدارة الأخطاء
- [ ] استخدم try/catch مع await
- [ ] استخدم .catch() مع Promise

```js
try {
  const users = await db.query("SELECT * FROM users");
} catch (err) {
  console.error("DB query failed", err);
}
```

---

## 4️⃣ فهم Event Loop
- [ ] Microtasks (Promise.then, queueMicrotask, async/await) تُنفّذ قبل Macrotasks (setTimeout, setInterval, I/O callbacks)
- [ ] ضع في ذهنك ترتيب التنفيذ عند دمج Microtasks و Macrotasks
- [ ] لا تعتمد على ترتيب الأكواد ظاهريًا

---

## 5️⃣ تجنّب Race Conditions
- [ ] استخدم Promise.all أو await بالتسلسل إذا كانت النتائج متعددة

```js
// ✅ تنفيذ متوازي للنتائج
const [users, orders] = await Promise.all([
  db.query("SELECT * FROM users"),
  db.query("SELECT * FROM orders")
]);
```

---

## 6️⃣ تأكيد العودة أو الاستجابة
- [ ] كل دالة async يجب أن ترجع قيمة أو ترسل استجابة في server code
- [ ] لا تترك async function بدون return أو بدون res.json()

```js
app.get('/users', async (req,res) => {
  const users = await db.query("SELECT * FROM users");
  res.json(users.rows);
});
```

---

## 7️⃣ وضوح وسهولة القراءة
- [ ] استعمل async/await للكود المتسلسل
- [ ] استعمل then/catch للأحداث المنفصلة
- [ ] ضع التعليقات عند تسلسل Microtask/Macrotask معقد

---

## 8️⃣ تجنب تسرب الذاكرة أو callbacks المتراكمة
- [ ] لا تترك Promises غير منتظر تنفيذها
- [ ] تأكد من تنظيف setTimeout أو setInterval عند الانتهاء

```js
const timer = setInterval(() => console.log("tick"), 1000);
clearInterval(timer); // عند الانتهاء
```

---

## 🔹 الخلاصة الذهبية
> **Always link your logic to the result, not the timing.**
> اربط كل خطوة async بالبيانات التي تنتجها، لا بالوقت المتوقع لوصولها.

---

📘 استخدم هذا الملف كمرجع دائم عند كتابة أي كود asynchronous في Node.js أو JavaScript

