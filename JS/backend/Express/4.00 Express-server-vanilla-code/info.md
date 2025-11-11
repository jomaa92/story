# Server Code Explanation

This document provides an explanation of the server code, including line-by-line comments in both English and Arabic. The code sets up a simple HTTP server that serves different HTML pages based on the requested URL.

---

## Code with Comments

```javascript
const { log, error } = require("console");

// Import 'log' and 'error' methods from 'console' module.
// استيراد الدوال 'log' و 'error' من وحدة 'console'.

const http = require("http"); 

// Import the 'http' module to create an HTTP server.
// استيراد وحدة 'http' لإنشاء خادم HTTP.

const fs = require("fs"); 

// Import the 'fs' module to interact with the file system.
// استيراد وحدة 'fs' للتعامل مع نظام الملفات.

console.log("Hello, Bro"); 

// Log a greeting message to the console.
// طباعة رسالة ترحيبية إلى وحدة التحكم.

const server = http.createServer((req, res) => {
    
// Create the server and define the request-response handler.
// إنشاء الخادم وتحديد معالج الطلب والاستجابة.

////////////////////////////////////////

console.log("=====================");

// Log separator lines for readability.
// طباعة فواصل للوضوح.

console.log("Request made:");
    
// Log that a request was made.
// طباعة أن هناك طلبًا تم.


console.log("The URL: " + req.url, "\nThe method: " + req.method); 

// Log the requested URL and method.
// طباعة الـ URL المطلوب والطريقة المستخدمة.

console.log("=====================");

console.log("*********************");

//////////////////////////////////////////

// Handle the request URL to serve different sections.
// معالجة الـ URL لتقديم أقسام مختلفة.

let path = "./Views/"; 

// Set the base path for the HTML files.
// تعيين المسار الأساسي لملفات HTML.

switch (req.url) { 
    
// Determine which file to serve based on the URL.
// تحديد الملف الذي سيتم تقديمه بناءً على الـ URL.

    case "/home":
    
    // If the URL is '/home'.
    // إذا كان الـ URL هو '/home'.
        
        path += "home.html"; 
        
        // Append 'home.html' to the path.
        // إضافة 'home.html' إلى المسار.
        
        break;

    case "/": 
    
    // If the URL is '/'.
    // إذا كان الـ URL هو '/'.
    
        path += "index.html";
        
        // Append 'index.html' to the path.
        // إضافة 'index.html' إلى المسار.
        
        break;

    default: 
    
    // For any other URL.
    // لأي URL آخر.
        
        path += "404.html"; 
        
        // Append '404.html' to serve a not-found page.
        // إضافة '404.html' لتقديم صفحة غير موجودة.
        
        break;
}

/////////////////////////////////////

// Send the HTML file to the client:
// إرسال ملف HTML إلى العميل:

fs.readFile(path, (error, data) => { 
    
// Read the HTML file from the file system.
// قراءة ملف HTML من نظام الملفات.
    
    if (error) {
        console.log("Error reading file."); 
        
        // Log an error message if reading fails.
        // طباعة رسالة خطأ إذا فشلت القراءة.
       
       res.end(); 
       
       // End the response.
       // إنهاء الاستجابة.
    
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' }); 
        
        // Set the response header to HTML.
        // تعيين ترويسة الاستجابة إلى HTML.
        
        res.end(data); 
        
        // Send the content of the HTML file.
        // إرسال محتوى ملف HTML.
    }
});

// Alternative response with inline HTML (commented out):
// استجابة بديلة مع HTML مضمّن (معلق):
// res.end("<p style='font-size:44px;'>Response ....</p>");
});

// Start the server and listen on port 2000:
// بدء تشغيل الخادم والاستماع على المنفذ 2000:

server.listen(2000, "localhost", () => {
console.log("Listening to the server on port 2000"); 

// Log that the server is listening.
// طباعة أن الخادم يستمع على المنفذ 2000.
});
```

---

## Explanation

### Importing Modules

- **English:** The code imports the necessary modules:
- `console` for logging.
- `http` to create an HTTP server.
- `fs` to interact with the file system.

- **Arabic:** يستورد الكود الوحدات الضرورية:
- `console` للتسجيل.
- `http` لإنشاء خادم HTTP.
- `fs` للتعامل مع نظام الملفات.

### Creating the Server

- **English:** The server is created using `http.createServer()`, which accepts a callback function to handle incoming requests (`req`) and send responses (`res`).

- **Arabic:** يتم إنشاء الخادم باستخدام `http.createServer()`، والذي يقبل دالة رد نداء لمعالجة الطلبات الواردة (`req`) وإرسال الاستجابات (`res`).

### Handling Requests

- **Logging Request Details:**
- **English:** Logs are added to display the URL and method of each incoming request.
- **Arabic:** تمت إضافة سجلات لعرض الـ URL والطريقة لكل طلب وارد.

- **Determining the Response:**
- **English:** A `switch` statement is used to determine which HTML file to serve based on the requested URL:
- If the URL is `/home`, it serves `home.html`.
- If the URL is `/`, it serves `index.html`.
- For any other URL, it serves `404.html`.

- **Arabic:** يتم استخدام عبارة `switch` لتحديد ملف HTML الذي سيتم تقديمه بناءً على الـ URL المطلوب:
- إذا كان الـ URL هو `/home`، يتم تقديم `home.html`.
- إذا كان الـ URL هو `/`، يتم تقديم `index.html`.
- لأي URL آخر، يتم تقديم `404.html`.

### Reading and Sending Files

- **English:** The `fs.readFile()` function reads the specified HTML file. If there's an error, it logs the error and ends the response. Otherwise, it sets the response header to `text/html` and sends the file content.

- **Arabic:** تقوم دالة `fs.readFile()` بقراءة ملف HTML المحدد. إذا كان هناك خطأ، فإنه يسجل الخطأ وينهي الاستجابة. خلاف ذلك، فإنه يعين ترويسة الاستجابة إلى `text/html` ويرسل محتوى الملف.

### Starting the Server

- **English:** The server listens on `localhost` at port `2000`. When the server starts, it logs a message indicating it's listening.

- **Arabic:** يستمع الخادم على `localhost` عند المنفذ `2000`. عند بدء تشغيل الخادم، فإنه يسجل رسالة تشير إلى أنه يستمع.

---

## Notes

- **Error Handling:**
- **English:** Proper error handling ensures that the server doesn't crash if there's an issue reading a file.
- **Arabic:** يضمن التعامل الصحيح مع الأخطاء أن الخادم لا يتعطل إذا كانت هناك مشكلة في قراءة ملف.

- **Response Headers:**
- **English:** Setting the `Content-Type` header to `text/html` ensures that the browser interprets the response correctly.
- **Arabic:** تعيين ترويسة `Content-Type` إلى `text/html` يضمن أن المستعرض يفسر الاستجابة بشكل صحيح.

- **Modular Code:**
- **English:** Using modular imports (`require`) makes the code organized and reusable.
- **Arabic:** استخدام الاستيراد المعياري (`require`) يجعل الكود منظمًا وقابلًا لإعادة الاستخدام.

---

## How to Run the Server

1. **Ensure Node.js is Installed:**

- **English:** Make sure you have Node.js installed on your machine.
- **Arabic:** تأكد من تثبيت Node.js على جهازك.

2. **Create the Necessary Files:**

- **English:** In the `Views` directory, create the following HTML files:
    - `index.html`
    - `home.html`
    - `404.html`

- **Arabic:** في دليل `Views`، أنشئ ملفات HTML التالية:
    - `index.html`
    - `home.html`
    - `404.html`

3. **Run the Server:**

- **English:** Use the command `node server.js` to start the server.
- **Arabic:** استخدم الأمر `node server.js` لبدء تشغيل الخادم.

4. **Access the Server:**

- **English:** Open a web browser and navigate to `http://localhost:2000/` to see the `index.html` page.
- **Arabic:** افتح مستعرض ويب وانتقل إلى `http://localhost:2000/` لمشاهدة صفحة `index.html`.

- **English:** Navigate to `http://localhost:2000/home` to see the `home.html` page.
- **Arabic:** انتقل إلى `http://localhost:2000/home` لمشاهدة صفحة `home.html`.

- **English:** Any other URL will display the `404.html` page.
- **Arabic:** أي URL آخر سيعرض صفحة `404.html`.

---

## Conclusion

- **English:** This server serves different HTML pages based on the URL requested by the client. It's a simple example of how routing can be handled in Node.js without using any external frameworks.

- **Arabic:** يقدم هذا الخادم صفحات HTML مختلفة بناءً على الـ URL المطلوب من قبل العميل. إنه مثال بسيط على كيفية التعامل مع التوجيه في Node.js دون استخدام أي أطر عمل خارجية.

---

**Feel free to modify and expand upon this code to suit your needs!**

**لا تتردد في تعديل هذا الكود وتوسيعه ليتناسب مع احتياجاتك!**