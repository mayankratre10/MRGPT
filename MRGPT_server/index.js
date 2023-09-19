import express from 'express';
import cors from 'cors';

const app = express();
import callAPI from './controller';

app.use(cors());


app.get("/",callAPI)

const port  = process.env.PORT || 3000 ;
app.listen(port, () => {  
    console.log("Server Started At" + port);
});