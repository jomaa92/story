/* console.log("Hallo Bro") */

import express from "express"
import {dirname} from "path"
import { fileURLToPath } from "url";
import path from "path"
import axios from 'axios';
import { error } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

/* app.use() */
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')));

// إعداد EJS كـ view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/", async (req, res) => {

    try {
        const responses = await axios.get("https://bored-api.appbrewery.com/random")
        const post = responses.data
        res.render("index", { data: post })
    } catch (error) {
        console.error(error)
        res.render("index", {
            data: { error: error.message }
        })
    }
})

app.post("/filter", async (req, res) => {
    try {
        let type = req.body.type
        let participants = req.body.participants

        console.log(!type)

         // التحقق من وجود القيم
        if (!type || !participants) {
            return res.render("index", {
                data: { error: "Please select both type and participants" }
            });
        }
        
        const responses = await axios.get(
            `https://bored-api.appbrewery.com/filter?type=${type}&participants=${participants}`
        )

        // التحقق من وجود نتائج
        if (!response.data || response.data.length === 0) {
            return res.render("index", {
                data: { error: "No activities found with these filters" }
            });
        }
        
        // تصحيح توليد الرقم العشوائي
        const randomIndex = Math.floor(Math.random() * responses.data.length);
        const posts = responses.data[randomIndex];
        
        res.render("index", { data: posts })
    } catch (error) {
        /* console.error(error) */
        res.render("index", { 
            data: { error: error.message } 
        })
    }
})

app.listen(PORT, () => {
    console.log(`Your server is running on port ${PORT}`)
})