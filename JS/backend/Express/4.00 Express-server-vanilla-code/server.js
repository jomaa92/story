const http = require("http");

console.log ("===============================================")
console.log("Hallo server");

//hier i build the request on the server 

const server = http.createServer((req ,res) =>{
console.log("request made");
console.log(req.url , req.method);

/////////////////////////////////////////////////
// "set header content type text-plain."

// res.setHeader("content-type","text/plain");
//res.write("Hallo i am the respons");
/////////////////////////////////////////////////

// set header content type html.
res.setHeader("content-type", "text/html");


//hier created the respons with HTML
res.write("<p>Hallo mann</p>");
//created the respons with HTML
res.write("<p style='background-color: red;'>Hallo hier ist the new style</p>");
//end the respons and send it to the page
res.end();

});
/////////////////////////////////////////////////

//listening for the requests on port 3000

server.listen(4000,'localhost',() => {
console.log("listening for the requests on port 4000")
});



