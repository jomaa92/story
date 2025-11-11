const { log, error } = require("console");
const http = require("http");
const { url } = require("inspector");
const fs = require("fs")

console.log("hallo Bro");

const server = http.createServer((req,res)=>{
    console.log()

    ////////////////////////////////////////

    console.log("=====================");
    console.log("request mode:");
    console,log("the URL:" + req.url ,"\nthe method:" + req.method);
    console.log("=====================");
    console.log("*********************");

    //////////////////////////////////////////
    //the request for url in to meny setion
    let path = "./Views/";

    switch(req.url){

        case "/home":
            path += "home.html";
            res.statusCode = 200;
            break;

        case "/home-me":
            res.statusCode = 301;
            res.setHeader("location","./home");
            res.end();
            break;

        case "/":
            path += "index.html";
            res.statusCode = 200;
            break;

        default:
       path += "404.html";
       res.statusCode = 404;
       break;
    }
    /////////////////////////////////////

    //send html file :
    fs.readFile(path,(error,Date) =>{
        if (error){
            console.log("error");
            res,end();
        }else{
            res.end(Date);
        }
    });
    
    // res.end("<p style = 'font-size:44px;'>respons ....</p>")
});


server.listen(2000,"localhost",()=>{
console.log("listening to the server of the port 2000")
});