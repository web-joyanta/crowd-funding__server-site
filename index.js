const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res)=>{
    res.send("Server in Running...");
})
app.listen(port, ()=>{
    console.log(`Server in Running on Port ${port}`);
});