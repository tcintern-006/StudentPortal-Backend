const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const apiRouter = require("./routes/coursesRoutes");
const app = express();
const pool  = require('./Config/db')
const cors = require("cors");
const router = require("./routes/instructorRoutes");
const stuRouter = require("./routes/studentsRoutes");
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/authRoutes");
const port = process.env.PORT || 3000;



app.use('/static', express.static('public'));
app.use(cors({
    origin: ["http://localhost:3000", "https://student-portal-nextjs-swart.vercel.app"],
    credentials: true
}));       
app.use(express.json()); 
app.use(cookieParser());



pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Database connected! Server time:', res.rows[0].now);
  }
});




app.use('/api' , router);
app.use('/api' ,apiRouter )
app.use('/api' , stuRouter)
app.use('/api' ,  authRouter)


app.listen(port, ()=> console.log(`Port is running on ${port}`))
