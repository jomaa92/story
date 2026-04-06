# Asynchronous JavaScript – دليل مبسّط (README)

---

## 1️⃣ ما هو Asynchronous JavaScript؟
### What is Asynchronous JavaScript?

**بالعربي:**
JavaScript ينفّذ الأوامر واحدًا تلو الآخر (Single Thread)، لكن بعض العمليات تأخذ وقتًا (مثل قاعدة البيانات، API، الملفات). بدل ما يوقف البرنامج، JavaScript يرسل هذه العمليات للخلفية ويكمل التنفيذ.

**In English:**
JavaScript runs in a single thread, but some operations take time (DB, APIs, files). Instead of blocking execution, these tasks run in the background and return later.

---

## 2️⃣ لماذا نحتاج Asynchronous Code؟
### Why Asynchronous Code Matters

**بالعربي:**
- عدم تجميد البرنامج
- سرعة واستجابة أفضل
- التعامل مع الشبكة وقواعد البيانات

**In English:**
- Prevent blocking
- Better performance
- Handle network & databases

---

## 3️⃣ Event Loop (الفكرة الأساسية)
### Event Loop (Core Idea)

**بالعربي:**
Event Loop هو المنسّق الذي يراقب:
- Call Stack
- Queues
ويقرّر متى تُنفّذ المهام غير المتزامنة.

**In English:**
The Event Loop coordinates execution by watching the Call Stack and task queues.

---

## 4️⃣ المكوّنات الرئيسية
### Main Components

```
Call Stack   → ينفّذ الكود الحالي
Web APIs     → الخلفية (timers, DB, fetch)
Queues       → انتظار التنفيذ
Event Loop   → المنسّق
```

---

## 5️⃣ Macrotask vs Microtask
### الفرق بين Microtask و Macrotask

### 🟦 Microtask Queue (أولوية أعلى)
- Promise.then / catch / finally
- async / await (ما بعد await)
- queueMicrotask

### 🟥 Macrotask Queue (أولوية أقل)
- setTimeout
- setInterval
- I/O (مثل DB callbacks)
- DOM Events

**القاعدة الذهبية / Golden Rule:**
> Event Loop ينفّذ كل الـ Microtasks أولًا، ثم Macrotask واحدة فقط.

---

## 6️⃣ مثال توضيحي
### Example

```js
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");
```

**الناتج / Output:**
```
1
4
3
2
```

---

## 7️⃣ async / await باختصار
### async / await in short

**بالعربي:**
`await` لا يوقف البرنامج، بل يؤجّل ما بعده إلى Microtask.

**In English:**
`await` pauses the function, not the whole program.

```js
async function test() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}

test();
console.log("C");
```

**Output:**
```
A
C
B
```

---

## 8️⃣ خلاصة نهائية
### Final Summary

- JavaScript لا ينتظر ⏳
- Event Loop هو المتحكّم 🧠
- Microtask دائمًا قبل Macrotask

---

📌 **احتفظ بهذا الملف كمرجع لك أثناء التعلّم**
📌 **Keep this file as a reference while learning**

