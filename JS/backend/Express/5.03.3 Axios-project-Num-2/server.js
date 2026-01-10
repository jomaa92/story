import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ================ التكوينات الأساسية ================
const app = express();
const PORT = process.env.PORT || 4000;

// ================ إعدادات Middleware ================
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ================ إعداد View Engine ================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ================ الثوابت والمتغيرات المساعدة ================
const API_BASE_URL = "https://bored-api.appbrewery.com";

// ================ دوال مساعدة ================
/**
 * دالة لمعالجة الأخطاء بشكل مركزي
 */
const handleError = (error, res, customMessage = null) => {
    console.error('API Error:', error.message);
    
    const errorData = {
        error: customMessage || "An error occurred while fetching activities. Please try again.",
        activity: null,
        type: null,
        participants: null
    };
    
    res.render("index", { data: errorData });
};

/**
 * دالة للتحقق من صحة بيانات الفلتر
 */
const validateFilterInput = (type, participants) => {
    if (!type || !participants) {
        return "Please select both activity type and number of participants";
    }
    
    // تحقق من أن عدد المشاركين رقم صحيح موجب
    const participantsNum = parseInt(participants);
    if (isNaN(participantsNum) || participantsNum < 1 || participantsNum > 8) {
        return "Please select a valid number of participants (1-8)";
    }
    
    return null; // لا يوجد خطأ
};

// ================ Routes ================

/**
 * الصفحة الرئيسية - عرض نشاط عشوائي
 */
app.get("/", async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/random`);
        const activity = response.data;
        
        res.render("index", { 
            data: activity 
        });
        
    } catch (error) {
        handleError(error, res, "Failed to fetch random activity");
    }
});

/**
 * معالجة فلترة الأنشطة
 */
app.post("/filter", async (req, res) => {
    try {
        const { type, participants } = req.body;
        
        // التحقق من صحة المدخلات
        const validationError = validateFilterInput(type, participants);
        if (validationError) {
            return res.render("index", {
                data: { 
                    error: validationError,
                    activity: null,
                    type: null,
                    participants: null
                }
            });
        }
        
        // جلب الأنشطة المفلترة
        const response = await axios.get(
            `${API_BASE_URL}/filter?type=${type}&participants=${participants}`
        );
        
        const activities = response.data;
        
        // التحقق من وجود نتائج
        if (!activities || activities.length === 0) {
            return res.render("index", {
                data: { 
                    error: `No activities found for type: ${type} with ${participants} participant(s)`,
                    activity: null,
                    type: null,
                    participants: null
                }
            });
        }
        
        // اختيار نشاط عشوائي من النتائج
        const randomIndex = Math.floor(Math.random() * activities.length);
        const selectedActivity = activities[randomIndex];
        
        res.render("index", { 
            data: selectedActivity 
        });
        
    } catch (error) {
        handleError(error, res, "Failed to filter activities");
    }
});

/**
 * صفحة 404 للروابط غير الموجودة
 */
app.use((req, res) => {
    res.status(404).render("index", {
        data: {
            error: "Page not found",
            activity: null,
            type: null,
            participants: null
        }
    });
});

// ================ تشغيل الخادم ================
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});