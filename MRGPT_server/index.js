const express = require('express');
// import OpenAI from "openai";
const cors = require('cors');
const app = express();
const callAPI  = require('./controller');

app.use(cors());


app.get("/",callAPI)

const port  = 3000 || process.env.PORT;
app.listen(port, () => {  
    console.log("Server Started At" + port);
});