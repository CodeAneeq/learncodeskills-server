import express from 'express';
import connectDB from './db/connect_db.js';
import Constants from './constant.js';
import authRoutes from './routes/user.routes.js'
import courseRoutes from './routes/course.routes.js'
import cors from 'cors'

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
connectDB(Constants.DB_URI);
app.use('/user/api', authRoutes);
app.use('/course/api', courseRoutes);
app.get('/', (req, res) => {
    res.send("Hello World!");
})

const PORT = process.env.PORT || Constants.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server runnning on http://localhost:${PORT}`);
})