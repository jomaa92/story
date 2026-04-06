# Asynchronous JavaScript – تمارين Event Loop (README)

هذا الملف يجمع **كل التمارين** التي عملنا عليها، مرتّبة من الأسهل إلى مستوى Dev / Senior، لتعود لها لاحقًا للمراجعة أو التدريب.

---

## 🟢 Exercise 1 – Microtask vs Macrotask (Basic)
### ❓ Guess the output

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

### ✅ Output
```
1
4
3
2
```

📌 الهدف:
- فهم أن `Promise.then` (Microtask) يُنفّذ قبل `setTimeout` (Macrotask)

---

## 🟡 Exercise 2 – async / await + Promises (Intermediate)

```js
async function test() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}

test();
console.log("C");
```

### ✅ Output
```
A
C
B
```

📌 الهدف:
- فهم أن ما بعد `await` يُسجَّل كـ Microtask

---

## 🟠 Exercise 3 – Mixed Queues

```js
console.log("A");

setTimeout(() => {
  console.log("B");

  Promise.resolve().then(() => {
    console.log("C");
  });
}, 0);

Promise.resolve().then(() => {
  console.log("D");

  setTimeout(() => {
    console.log("E");
  }, 0);
});

async function test() {
  console.log("F");
  await Promise.resolve();
  console.log("G");

  setTimeout(() => {
    console.log("H");
  }, 0);
}

test();

console.log("I");
```

### ✅ Output
```
A
F
I
D
G
B
C
E
H
```

📌 الهدف:
- فهم تسجيل المهام أثناء التنفيذ
- معرفة أن Microtasks تُفرّغ بالكامل قبل أي Macrotask

---

## 🔴 Exercise 4 – Dev-Level Challenge

```js
console.log("1");

setTimeout(() => {
  console.log("2");

  Promise.resolve().then(() => {
    console.log("3");
  });

  setTimeout(() => {
    console.log("4");
  }, 0);
}, 0);

Promise.resolve().then(() => {
  console.log("5");

  queueMicrotask(() => {
    console.log("6");
  });

  setTimeout(() => {
    console.log("7");
  }, 0);
});

async function test() {
  console.log("8");
  await null;
  console.log("9");

  Promise.resolve().then(() => {
    console.log("10");
  });
}

test();

console.log("11");
```

### ✅ Output
```
1
8
11
5
6
9
10
2
3
4
7
```

📌 الهدف:
- mastery حقيقي لـ Event Loop
- فهم queueMicrotask
- فهم متى تُسجَّل Macrotasks

---

## 🧠 Tips للمراجعة
- Microtask دائمًا قبل Macrotask
- `await` لا يوقف البرنامج
- وقت **تسجيل المهمة** أهم من مكان كتابتها

---

📘 احتفظ بهذا الملف كمصدر تدريب دائم
📘 Keep this file as a permanent practice reference

