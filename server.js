const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const apiRouter = require("./routes/coursesRoutes");
const app = express();
const pool = require('./Config/db')
const cors = require("cors");
const router = require("./routes/instructorRoutes");
const stuRouter = require("./routes/studentsRoutes");
const authRouter = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");
const port = process.env.PORT || 3000;

app.use('/static', express.static('public'));
app.use(cors({
     origin: ["https://student-portal-nextjs-swart.vercel.app"]
 }));

// app.use(cors());
app.use(express.json());

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Database connected! Server time:', res.rows[0].now);
  }
});

app.use('/api', router);
app.use('/api', apiRouter)
app.use('/api', stuRouter)
app.use('/api', authRouter)



app.use(errorHandler)  
app.listen(port, () => console.log(`Port is running on ${port}`))
