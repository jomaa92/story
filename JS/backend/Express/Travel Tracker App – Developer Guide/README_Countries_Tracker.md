🎯 الجزء الأول: كيف يفكر المبرمج؟
1. قبل كتابة أي كود - مرحلة التخطيط

المبرمج المحترف لا يبدأ بكتابة الكود مباشرة، بل يفكر كالتالي:


// خطوات التفكير:
// 1️⃣ ماذا أريد أن يفعله البرنامج؟ (الهدف)
// 2️⃣ ما هي المكونات التي أحتاجها؟ (البيانات)
// 3️⃣ كيف ستتفاعل هذه المكونات؟ (المنطق)
// 4️⃣ ماذا يمكن أن يخطئ؟ (معالجة الأخطاء)

2. تحليل مشروعك الحالي


// 📝 الهدف: تطبيق لتتبع الدول التي زارها المستخدمون
// 
// المكونات الرئيسية:
// 1. نظام المستخدمين (Users)
// 2. نظام الدول (Countries)
// 3. نظام تسجيل الزيارات (Visited Countries)
// 4. واجهة المستخدم (UI)

📚 الجزء الثاني: إعادة هيكلة الكود بطريقة احترافية
الخطوة 1: تنظيم الملفات أولاً

project/
│
├── server.js           // الملف الرئيسي
├── database/
│   └── setup.sql       // ملف إعداد قاعدة البيانات
├── routes/
│   ├── users.js        // مسارات المستخدمين
│   └── countries.js    // مسارات الدول
├── views/
│   ├── index.ejs
│   └── new.ejs
└── public/
    └── css/
        └── style.css

الخطوة 2: كتابة الكود بطريقة منظمة


// ============================================
// ملف: server.js (الملف الرئيسي)
// ============================================

// 1️⃣ أولاً: استيراد المكتبات المطلوبة
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// 2️⃣ ثانياً: إنشاء التطبيق
const app = express();
const port = 3000;

// 3️⃣ ثالثاً: إعداد قاعدة البيانات (باتباع أفضل الممارسات)
class Database {
    constructor() {
        this.connection = new pg.Client({
            user: "app_user",
            host: "localhost",
            database: "postgres",
            password: "yarevS1992@",
            port: 5432,
        });
    }

    async connect() {
        try {
            await this.connection.connect();
            console.log("✅ Database connected successfully");
        } catch (error) {
            console.error("❌ Database connection failed:", error);
            process.exit(1); // إنهاء التطبيق إذا فشل الاتصال
        }
    }

    async query(sql, params) {
        try {
            return await this.connection.query(sql, params);
        } catch (error) {
            console.error("❌ Query failed:", sql, params);
            throw error;
        }
    }
}

// إنشاء كائن قاعدة البيانات
const db = new Database();
await db.connect();

// 4️⃣ رابعاً: إعداد middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// ============================================
// 5️⃣ خامساً: طبقة الخدمات (Service Layer)
// ============================================

class UserService {
    constructor(database) {
        this.db = database;
    }

    // الحصول على جميع المستخدمين
    async getAllUsers() {
        const result = await this.db.query("SELECT * FROM users ORDER BY id");
        return result.rows;
    }

    // الحصول على مستخدم محدد
    async getUserById(userId) {
        const result = await this.db.query(
            "SELECT * FROM users WHERE id = $1",
            [userId]
        );
        return result.rows[0] || null;
    }

    // إنشاء مستخدم جديد
    async createUser(name, color) {
        // التحقق من المدخلات
        if (!name || !color) {
            throw new Error("Name and color are required");
        }

        const result = await this.db.query(
            "INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *",
            [name, color]
        );
        return result.rows[0];
    }
}

class CountryService {
    constructor(database) {
        this.db = database;
    }

    // البحث عن دولة بالاسم
    async findCountryByName(countryName) {
        if (!countryName || countryName.trim() === "") {
            throw new Error("Country name is required");
        }

        const result = await this.db.query(
            "SELECT * FROM countries WHERE LOWER(country_name) = LOWER($1)",
            [countryName.trim()]
        );
        return result.rows[0] || null;
    }

    // الحصول على الدول التي زارها مستخدم
    async getVisitedCountries(userId) {
        const result = await this.db.query(
            "SELECT country_code FROM visited_countries WHERE user_id = $1",
            [userId]
        );
        return result.rows.map(row => row.country_code);
    }

    // إضافة دولة تم زيارتها
    async addVisitedCountry(userId, countryCode) {
        // التحقق من عدم تكرار الإدخال
        const exists = await this.db.query(
            "SELECT * FROM visited_countries WHERE user_id = $1 AND country_code = $2",
            [userId, countryCode]
        );

        if (exists.rows.length > 0) {
            throw new Error("Country already added");
        }

        await this.db.query(
            "INSERT INTO visited_countries (user_id, country_code) VALUES ($1, $2)",
            [userId, countryCode]
        );
    }
}

// ============================================
// 6️⃣ سادساً: إنشاء خدمات التطبيق
// ============================================

const userService = new UserService(db);
const countryService = new CountryService(db);

// ============================================
// 7️⃣ سابعاً: إدارة حالة التطبيق
// ============================================

class AppState {
    constructor() {
        this._currentUserId = null;
        this._users = [];
    }

    get currentUserId() {
        return this._currentUserId;
    }

    set currentUserId(id) {
        this._currentUserId = id;
        console.log(`🔄 Current user changed to: ${id}`);
    }

    get users() {
        return this._users;
    }

    set users(userList) {
        this._users = userList;
    }

    async refreshUsers() {
        this._users = await userService.getAllUsers();
        console.log(`🔄 Users list refreshed: ${this._users.length} users`);
    }

    async getCurrentUser() {
        if (!this._currentUserId) return null;
        return await userService.getUserById(this._currentUserId);
    }
}

const appState = new AppState();

// ============================================
// 8️⃣ ثامناً: تهيئة التطبيق
// ============================================

async function initializeApp() {
    try {
        await appState.refreshUsers();
        
        // تعيين أول مستخدم كافتراضي إذا وجد
        if (appState.users.length > 0) {
            appState.currentUserId = appState.users[0].id;
        }
        
        console.log("✅ App initialized successfully");
        console.log(`📊 Users: ${appState.users.length}`);
    } catch (error) {
        console.error("❌ App initialization failed:", error);
    }
}

await initializeApp();

// ============================================
// 9️⃣ تاسعاً: المسارات (Routes)
// ============================================

// الصفحة الرئيسية
app.get("/", async (req, res) => {
    try {
        const currentUser = await appState.getCurrentUser();
        const visitedCountries = await countryService.getVisitedCountries(appState.currentUserId);
        
        // تجهيز البيانات للقالب
        const viewData = {
            countries: visitedCountries,
            total: visitedCountries.length,
            users: appState.users,
            color: currentUser?.color || "#cccccc",
            currentUserName: currentUser?.name || "No user selected"
        };

        console.log("📤 Rendering with data:", viewData);
        res.render("index.ejs", viewData);
        
    } catch (error) {
        console.error("❌ Error in GET /:", error);
        res.status(500).render("error.ejs", { 
            message: "An error occurred loading the page" 
        });
    }
});

// إضافة دولة جديدة
app.post("/add", async (req, res) => {
    try {
        const { country } = req.body;
        
        // التحقق من وجود مستخدم محدد
        if (!appState.currentUserId) {
            throw new Error("No user selected");
        }

        // البحث عن الدولة
        const foundCountry = await countryService.findCountryByName(country);
        
        if (!foundCountry) {
            // إعادة تحميل الصفحة مع رسالة خطأ
            const visitedCountries = await countryService.getVisitedCountries(appState.currentUserId);
            const currentUser = await appState.getCurrentUser();
            
            return res.render("index.ejs", {
                countries: visitedCountries,
                total: visitedCountries.length,
                users: appState.users,
                color: currentUser?.color,
                error: `Country "${country}" not found`
            });
        }

        // إضافة الدولة
        await countryService.addVisitedCountry(
            appState.currentUserId, 
            foundCountry.country_code
        );

        console.log(`✅ Added ${foundCountry.country_name} for user ${appState.currentUserId}`);
        res.redirect("/");
        
    } catch (error) {
        console.error("❌ Error in POST /add:", error);
        
        // التعامل مع الأخطاء المختلفة
        const visitedCountries = await countryService.getVisitedCountries(appState.currentUserId);
        const currentUser = await appState.getCurrentUser();
        
        let errorMessage = error.message;
        if (error.message === "Country already added") {
            errorMessage = "This country has already been added";
        }

        res.render("index.ejs", {
            countries: visitedCountries,
            total: visitedCountries.length,
            users: appState.users,
            color: currentUser?.color,
            error: errorMessage
        });
    }
});

// تغيير المستخدم أو إضافة مستخدم جديد
app.post("/user", async (req, res) => {
    try {
        if (req.body.add === "new") {
            res.render("new.ejs");
        } else {
            const selectedUserId = parseInt(req.body.user);
            
            // التحقق من وجود المستخدم
            const userExists = appState.users.some(u => u.id === selectedUserId);
            
            if (userExists) {
                appState.currentUserId = selectedUserId;
                console.log(`✅ Switched to user: ${selectedUserId}`);
            } else {
                // تحديث قائمة المستخدمين والمحاولة مرة أخرى
                await appState.refreshUsers();
                
                if (appState.users.length > 0) {
                    appState.currentUserId = appState.users[0].id;
                }
            }
            
            res.redirect("/");
        }
    } catch (error) {
        console.error("❌ Error in POST /user:", error);
        res.redirect("/");
    }
});

// إضافة مستخدم جديد
app.post("/new", async (req, res) => {
    try {
        const { name, color } = req.body;
        
        // إنشاء المستخدم الجديد
        const newUser = await userService.createUser(name, color);
        
        // تحديث حالة التطبيق
        await appState.refreshUsers();
        appState.currentUserId = newUser.id;
        
        console.log(`✅ New user created: ${newUser.name}`);
        res.redirect("/");
        
    } catch (error) {
        console.error("❌ Error in POST /new:", error);
        
        res.render("new.ejs", {
            error: error.message || "Failed to create user"
        });
    }
});

// ============================================
// 🔟 أخيراً: تشغيل الخادم
// ============================================

app.listen(port, () => {
    console.log(`\n🚀 Server is running!`);
    console.log(`📡 http://localhost:${port}`);
    console.log(`🕒 ${new Date().toLocaleString()}\n`);
});

🎓 الجزء الثالث: شرح طريقة التفكير
مبادئ التفكير البرمجي التي طبقناها:
1. مبدأ الفصل بين المسؤوليات (Separation of Concerns)


// ❌ خطأ: كل شيء في مكان واحد
app.get("/", async () => {
    // قاعدة البيانات هنا
    // منطق العمل هنا
    // عرض الصفحة هنا
})

// ✅ صح: كل جزء له مسؤوليته
class Database { }        // قاعدة البيانات فقط
class UserService { }     // منطق المستخدمين فقط  
class AppState { }        // حالة التطبيق فقط
app.get("/", () => { })   // المسار فقط

2. مبدأ عدم التكرار (DRY - Don't Repeat Yourself)
javascript

// ❌ خطأ: تكرار نفس الكود
const result1 = await db.query("SELECT * FROM users");
const result2 = await db.query("SELECT * FROM users WHERE id = 1");

// ✅ صح: دالة واحدة لكل مهمة
async function getAllUsers() { }
async function getUserById(id) { }

3. مبدأ معالجة الأخطاء (Error Handling)


// ❌ خطأ: تجاهل الأخطاء
try {
    // كود قد يخطئ
} catch (err) {
    // لا شيء
}

// ✅ صح: معالجة كل خطأ بشكل مناسب
try {
    // كود قد يخطئ
} catch (err) {
    if (err.code === '23505') {
        // خطأ تكرار
    } else if (err.code === '23503') {
        // خطأ مفتاح خارجي
    } else {
        // خطأ غير متوقع
    }
}

🔍 الجزء الرابع: كيف تفحص الكود وتجد الأخطاء؟
خطوات التصحيح المنهجية:


// 1️⃣ استخدم console.log بشكل استراتيجي
console.log("🔍 1. بداية الدالة");
console.log("📥 المدخلات:", { name, color });
console.log("📤 المخرجات:", result);
console.log("✅ نهاية الدالة");

// 2️⃣ تحقق من كل خطوة على حدة
async function addCountry(userId, countryName) {
    console.log("📝 الخطوة 1: التحقق من المدخلات");
    if (!userId) throw new Error("No user ID");
    
    console.log("📝 الخطوة 2: البحث عن الدولة");
    const country = await findCountry(countryName);
    
    console.log("📝 الخطوة 3: إضافة الدولة");
    await insertVisitedCountry(userId, country.code);
}

// 3️⃣ استخدم try-catch في كل مكان
try {
    await riskyOperation();
} catch (error) {
    console.error("❌ تفاصيل الخطأ:", {
        message: error.message,
        stack: error.stack,
        time: new Date().toISOString()
    });
}

📝 الجزء الخامس: تمارين عملية لك
تمرين 1: أضف خاصية جديدة

حاول إضافة خاصية "عدد مرات الزيارة" لكل دولة:


// فكر كيف ستفعل هذا؟
// 1. هل تحتاج لتغيير قاعدة البيانات؟
// 2. كيف ستعدل الخدمات؟
// 3. كيف ستظهرها في الواجهة؟

تمرين 2: تحسين الأداء

أضف خاصية التخزين المؤقت (Caching):


// فكر: كيف تخزن البيانات مؤقتاً؟
// متى تحدث هذه البيانات؟
// متى تحذفها؟

تمرين 3: إضافة صلاحيات

اجعل كل مستخدم يرى دوله فقط:


// فكر: كيف تمنع مستخدم من رؤية دول غيره؟
// أين ستضع هذا التحقق؟

🎯 الخلاصة: نصائح ذهبية

    ابدأ دائماً بالورقة والقلم - ارسم ما تريد بناءه

    قسم المشكلة إلى أجزاء صغيرة - جزء صغير يعمل أفضل من كبير لا يعمل

    اختبر كل جزء على حدة - لا تنتظر حتى النهاية

    تعلم من الأخطاء - كل خطأ فرصة للتعلم

    اقرأ كود غيرك - أفضل طريقة للتعلم

    اكتب تعليقات مفيدة - ليس "هذا متغير" بل "لماذا هذا المتغير"
