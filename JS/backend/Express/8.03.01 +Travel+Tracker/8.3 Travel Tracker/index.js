import"dotenv/config"
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password :process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// تأخير تعريف دالة الاتصال حتى يتم التعامل مع الأخطاء بشكل أفضل
let isDbConnected = false;

async function dbConnect() {
    try {
        await db.connect();
        isDbConnected = true;
        console.log("### Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); // إنهاء التطبيق إذا فشل الاتصال
    }
}

dbConnect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// دالة مساعدة لجلب البلدان الزارَعة
async function getVisitedCountries() {
    try {
        const result = await db.query("SELECT country_code FROM visited_country ORDER BY country_code");
        return result.rows.map(row => row.country_code);
    } catch (error) {
        console.error("Error fetching visited countries:", error.message);
        return [];
    }
}

app.get("/", async (req, res) => {
    try {
        if (!isDbConnected) {
            throw new Error("Database not connected");
        }

        const countries = await getVisitedCountries();
        console.log("Countries fetched:", countries);
        
        res.render("index.ejs", {
            countries: countries,
            total: countries.length,
            error: null
        });

    } catch (error) {
        console.error("Error in GET /:", error.message);
        res.status(500).render("index.ejs", {
            countries: [],
            total: 0,
            error: "Server error. Please try again later."
        });
    }
});

app.post("/add", async (req, res) => {
    try {
        if (!isDbConnected) {
            throw new Error("Database not connected");
        }

        const inputCountry = req.body.country ? req.body.country.trim() : '';
        
        if (!inputCountry) {
            const countries = await getVisitedCountries();
            return res.render("index.ejs", {
                countries: countries,
                total: countries.length,
                error: "Please enter a country name"
            });
        }
        
        // البحث عن البلد (استخدم = بدلاً من ILIKE إذا تريد مطابقة تامة)
        const countryResult = await db.query(
            "SELECT country_code FROM countries WHERE LOWER(country_name) = LOWER($1)",
            [inputCountry]
        );
        
        if (countryResult.rows.length === 0) {
            const countries = await getVisitedCountries();
            return res.render("index.ejs", {
                countries: countries,
                total: countries.length,
                error: `Country "${inputCountry}" not found`
            });
        }
        
        const countryCode = countryResult.rows[0].country_code;
        
        // التحقق من التكرار
        const exists = await db.query(
            "SELECT * FROM visited_country WHERE country_code = $1",
            [countryCode]
        );
        
        if (exists.rows.length > 0) {
            const countries = await getVisitedCountries();
            return res.render("index.ejs", {
                countries: countries,
                total: countries.length,
                error: `"${inputCountry}" is already in your list`
            });
        }
        
        // إضافة البلد الجديد
        await db.query(
            "INSERT INTO visited_country (country_code) VALUES ($1)",
            [countryCode]
        );
        
        // إعادة التوجيه بعد النجاح
        res.redirect("/");
        
    } catch (error) {
        console.error("Error in POST /add:", error.message);
        
        try {
            const countries = await getVisitedCountries();
            res.render("index.ejs", {
                countries: countries,
                total: countries.length,
                error: "Error adding country. Please try again."
            });
        } catch (innerError) {
            res.status(500).render("index.ejs", {
                countries: [],
                total: 0,
                error: "Server error. Please try again later."
            });
        }
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// معالجة إغلاق الاتصال عند إنهاء التطبيق
process.on('SIGINT', async () => {
    console.log('Closing database connection...');
    await db.end();
    process.exit(0);
});