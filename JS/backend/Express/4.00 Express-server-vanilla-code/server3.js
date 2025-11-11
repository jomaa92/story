const { log, error } = require("console"); 
// Import 'log' and 'error' methods from the 'console' module.
// استيراد الدوال 'log' و 'error' من وحدة 'console'.
const http = require("http"); 
// Import the 'http' module to create an HTTP server.
// استيراد وحدة 'http' لإنشاء خادم HTTP.
const fs = require("fs"); 
// Import the 'fs' module to work with the file system.
// استيراد وحدة 'fs' للتعامل مع نظام الملفات.
console.log("***Hello server Jm***"); 
// Log a greeting message to the console.
// طباعة رسالة ترحيبية إلى وحدة التحكم.


////////////////////////////////////////
const server = http.createServer((req, res) => { 
// Create the server and define the request-response handler.
// إنشاء الخادم وتحديد معالج الطلب والاستجابة.
console.log("*********************");
console.log("====================="); 
// Log separator lines for readability.
// طباعة فواصل للوضوح.    
console.log("Request made:"); 
// Log that a request was made.
// طباعة أن هناك طلبًا تم.   
console.log("The URL: " + req.url, "\nThe method:" + req.method); 
// Log the requested URL and method.
// طباعة الـ URL المطلوب والطريقة المستخدمة.   
console.log("=====================");
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
            path += "home.html"; // Append 'home.html' to the path.
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

// res.end("<p style='font-size:44px;'>Response ....</p>"); 
// Alternative response with inline HTML.
// // استجابة بديلة مع HTML مضمّن.
});

// Start the server and listen on port 2000:
// بدء تشغيل الخادم والاستماع على المنفذ 2000:
server.listen(2000, "localhost", () => {
    console.log("Listening to the server on port 2000"); 
    // Log that the server is listening.
    // طباعة أن الخادم يستمع على المنفذ 2000.
});
