const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const apiRouter = require("./routes/coursesRoutes");
const app = express();

const cors = require("cors");


const port = process.env.PORT || 3000;
app.use('/static', express.static('public'));


app.use(cors());           
app.use(express.json()); 

app.use('/api' ,apiRouter )




app.listen(port, ()=> console.log(`Port is running on ${port}`))