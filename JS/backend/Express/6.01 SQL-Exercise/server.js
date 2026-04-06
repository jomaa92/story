import pg from 'pg';
import express from 'express';

const app = express();
const PORT = 3000;

const db = new pg.Client({
    user:"app_user",
    host:"localhost",
    database:"postgres",
    password:"yarevS1992@",
    port:5432,
    
});

db.connect();
console.log("the database is connected")

async function responsData(){
    try {
            app.get("/capitals",async(req,res)=>{

           try

           {
                const result =  await db.query("SELECT * FROM capitals");
                console.log(result.rows)

            }
            catch(error)
            {
                console.log(error.message)
            }

           
               
        });
   
    } catch (error) {
        console.log(error.message);   
    }
};
responsData();




/* async function getCapitals() {
    try {
        const result  = await db.query("SELECT * FROM capitals")
        if (result.rows.length === 0) {
        console.log("No data found");
} else {
    console.log(result.rows);
}

    } catch (error) {
        console.log(error.message)
    }
}

getCapitals(); */